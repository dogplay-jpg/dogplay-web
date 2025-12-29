#!/usr/bin/env python3
"""
Daily News Content Generator for Dogplay Agent SEO Platform

This script:
1. Fetches latest iGaming/Cricket news from Brave Search API
2. Generates blog content using Chutes.ai LLM API
3. Creates cover images using Chutes.ai Image API
4. Publishes content as Markdown/MDX files
5. Commits changes to Git repository

PRD Reference: Section 3.2 - Automation Engine
"""

import os
import sys
import json
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional, Any
import requests
import markdown
from dataclasses import dataclass, asdict
import hashlib
import re

# Configuration
@dataclass
class Config:
    """Configuration from environment variables"""
    brave_search_api_key: str
    chutes_llm_api_key: str
    chutes_image_api_key: str
    github_token: str
    github_repo: str
    content_dir: str = "src/content/posts"
    ops_dir: str = "src/content/ops"
    min_word_count: int = 300
    similarity_threshold: float = 0.7

    @classmethod
    def from_env(cls) -> 'Config':
        """Load configuration from environment variables"""
        return cls(
            brave_search_api_key=os.getenv('BRAVE_SEARCH_API_KEY', ''),
            chutes_llm_api_key=os.getenv('CHUTES_LLM_API_KEY', ''),
            chutes_image_api_key=os.getenv('CHUTES_IMAGE_API_KEY', ''),
            github_token=os.getenv('GITHUB_TOKEN', ''),
            github_repo=os.getenv('GITHUB_REPOSITORY', ''),
        )

    def validate(self) -> bool:
        """Validate required configuration"""
        required = [
            self.brave_search_api_key,
            self.chutes_llm_api_key,
            self.chutes_image_api_key,
        ]
        return all(required)

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class BraveSearchClient:
    """Client for Brave Search API - News Discovery"""

    BASE_URL = "https://api.search.brave.com/res/v1/news/search"

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': api_key,
        })

    def search_news(
        self,
        query: str,
        max_results: int = 10,
        freshness: str = '1d'
    ) -> List[Dict[str, Any]]:
        """
        Search for news articles

        Args:
            query: Search query
            max_results: Maximum number of results
            freshness: Time filter (1d, 1w, 1m)

        Returns:
            List of news articles
        """
        try:
            params = {
                'q': query,
                'count': max_results,
                'freshness': freshness,
                'text_decorations': False,
            }

            response = self.session.get(self.BASE_URL, params=params, timeout=30)
            response.raise_for_status()

            data = response.json()

            results = []
            for item in data.get('web', {}).get('results', []):
                # Parse published date if available
                published_date = None
                if 'age' in item:
                    published_date = self._parse_age(item['age'])
                elif 'published_time' in item:
                    published_date = datetime.fromisoformat(
                        item['published_time'].replace('Z', '+00:00')
                    )

                # Only include articles from last 24 hours
                if published_date and published_date < datetime.now() - timedelta(days=1):
                    continue

                results.append({
                    'title': item.get('title', ''),
                    'url': item.get('url', ''),
                    'snippet': item.get('description', ''),
                    'published_date': published_date.isoformat() if published_date else None,
                    'source': item.get('source', {}).get('name', 'Unknown'),
                })

            logger.info(f"Found {len(results)} relevant articles for query: {query}")
            return results

        except requests.RequestException as e:
            logger.error(f"Brave Search API error: {e}")
            return []

    def _parse_age(self, age_str: str) -> Optional[datetime]:
        """Parse age string like '2 hours ago' into datetime"""
        now = datetime.now()
        age_str = age_str.lower().strip()

        match = re.match(r'(\d+)\s+(hour|hours|day|days|minute|minutes)\s+ago', age_str)
        if match:
            value = int(match.group(1))
            unit = match.group(2)

            if 'minute' in unit:
                return now - timedelta(minutes=value)
            elif 'hour' in unit:
                return now - timedelta(hours=value)
            elif 'day' in unit:
                return now - timedelta(days=value)

        return now


class ChutesLLMClient:
    """Client for Chutes.ai LLM API - Content Generation"""

    BASE_URL = "https://llm.chutes.ai/v1"

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        })

    def generate_article(
        self,
        news_items: List[Dict[str, Any]],
        language: str = 'en'
    ) -> Dict[str, Any]:
        """
        Generate blog article from news items

        Args:
            news_items: List of news articles
            language: Target language (en, hi, zh)

        Returns:
            Generated article with metadata
        """
        prompts = self._get_prompts(language)

        # Build context from news items
        news_context = "\n\n".join([
            f"- {item['title']}: {item['snippet']}\n  Source: {item['source']}\n  URL: {item['url']}"
            for item in news_items[:5]
        ])

        try:
            response = self.session.post(
                f"{self.BASE_URL}/chat/completions",
                json={
                    'model': 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B',
                    'messages': [
                        {
                            'role': 'system',
                            'content': prompts['system']
                        },
                        {
                            'role': 'user',
                            'content': f"{prompts['user']}\n\nNews Sources:\n{news_context}"
                        }
                    ],
                    'temperature': 0.7,
                    'max_tokens': 2000,
                },
                timeout=60
            )
            response.raise_for_status()

            result = response.json()
            content = result['choices'][0]['message']['content']

            # Parse structured response
            article = self._parse_article_response(content, news_items, language)

            return article

        except (requests.RequestException, KeyError, json.JSONDecodeError) as e:
            logger.error(f"Chutes LLM API error: {e}")
            raise

    def _get_prompts(self, language: str) -> Dict[str, str]:
        """Get generation prompts for different languages"""
        prompts = {
            'en': {
                'system': '''You are a professional iGaming and cricket betting content writer for the Indian market.
Your task is to create informative, engaging blog articles based on provided news sources.

REQUIREMENTS:
1. Include sources section with all provided news URLs
2. Never fabricate facts or quotes
3. Use clear, professional language
4. Naturally include "Dogplay Agent" as a solution for betting partnerships
5. Focus on value for Indian affiliates and bettors
6. Include SEO-optimized headings and structure
7. Target 500-800 words

OUTPUT FORMAT (JSON):
{
  "title": "Article title",
  "excerpt": "Brief summary (150 chars)",
  "content": "Full article content in HTML format",
  "seo_title": "SEO title (60 chars)",
  "seo_description": "Meta description (160 chars)",
  "category": "Cricket or iGaming",
  "sources": ["Source 1", "Source 2"]
}''',
                'user': 'Create a comprehensive article about the latest iGaming/cricket betting news in India.'
            },
            'hi': {
                'system': '''आप भारतीय बाजार के लिए एक पेशेवर iGaming और क्रिकेट बेटिंग सामग्री लेखक हैं।
आपका कार्य प्रदान किए गए समाचार स्रोतों के आधार पर जानकारीपूर्ण ब्लॉग लेख बनाना है।

आवश्यकताएं:
1. सभी समाचार URLs के साथ स्रोत अनुभाग शामिल करें
2. कभी भी तथ्य या उद्धरण न बनाएं
3. स्पष्ट, पेशेवर भाषा का प्रयोग करें
4. प्राकृतिक रूप से "Dogplay एजेंट" को बेटिंग साझेदारी के लिए एक समाधान के रूप में शामिल करें
5. भारतीय एफिलिएट्स और बेटर्स के लिए मूल्य पर ध्यान दें
6. SEO-अनुकूलित शीर्षक और संरचना शामिल करें
7. 500-800 शब्द लक्ष्य

आउटपुट प्रारूप (JSON):
{same structure as English}''',
                'user': 'भारत में नवीनतम iGaming/क्रिकेट बेटिंग समाचार के बारे में एक विस्तृत लेख बनाएं।'
            },
            'zh': {
                'system': '''你是针对印度市场的专业 iGaming 和板球博彩内容撰稿人。
你的任务是基于提供的新闻来源创建信息丰富、引人入胜的博客文章。

要求：
1. 包含所有提供的新闻 URL 来源部分
2. 绝不捏造事实或引用
3. 使用清晰、专业的语言
4. 自然地提及 "Dogplay Agent" 作为博彩合作解决方案
5. 专注于为印度联盟会员和投注者提供价值
6. 包含 SEO 优化的标题和结构
7. 目标 500-800 词

输出格式 (JSON)：
{same structure as English}''',
                'user': '创建一篇关于印度最新 iGaming/板球博彩新闻的综合文章。'
            }
        }
        return prompts.get(language, prompts['en'])

    def _parse_article_response(
        self,
        content: str,
        news_items: List[Dict[str, Any]],
        language: str
    ) -> Dict[str, Any]:
        """Parse LLM response into structured article"""
        try:
            # Try to extract JSON from response
            json_match = re.search(r'\{[\s\S]*\}', content)
            if json_match:
                article_data = json.loads(json_match.group())
            else:
                # Fallback: create structure from plain text
                article_data = {
                    'title': content.split('\n')[0].strip('#').strip(),
                    'excerpt': content[:150] + '...',
                    'content': content,
                    'seo_title': content.split('\n')[0].strip('#').strip()[:60],
                    'seo_description': content[:160],
                    'category': 'iGaming',
                    'sources': [item['url'] for item in news_items]
                }

            # Add metadata
            slug = self._generate_slug(article_data['title'], language)
            article_data.update({
                'slug': slug,
                'language': language,
                'date': datetime.now().isoformat(),
                'sources': list(set(article_data.get('sources', []) + [item['url'] for item in news_items])),
                'word_count': len(article_data.get('content', '').split()),
            })

            return article_data

        except (json.JSONDecodeError, KeyError) as e:
            logger.error(f"Failed to parse article response: {e}")
            raise

    def _generate_slug(self, title: str, language: str) -> str:
        """Generate URL-safe slug from title"""
        # Convert to lowercase, replace spaces with hyphens
        slug = title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        slug = slug.strip('-')

        # Add date prefix
        date_prefix = datetime.now().strftime('%Y-%m-%d')
        return f"{date_prefix}-{slug}"


class ChutesImageClient:
    """Client for Chutes.ai Image Generation API

    Note: Chutes.ai primarily provides LLM services.
    For image generation, you may need to use a different service
    (e.g., OpenAI DALL-E, Stability AI, etc.)
    """

    BASE_URL = "https://api.openai.com/v1"  # Placeholder - configure actual image API

    def __init__(self, api_key: str = None):
        self.api_key = api_key
        self.session = requests.Session()
        if api_key:
            self.session.headers.update({
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json',
            })

    def generate_cover_image(
        self,
        article_title: str,
        article_content: str
    ) -> Optional[str]:
        """
        Generate cover image for article

        Args:
            article_title: Article title
            article_content: Article content/excerpt

        Returns:
            Image URL or None
        """
        # Currently disabled - configure an image generation API (DALL-E, Stability AI, etc.)
        logger.info(f"Image generation disabled for: {article_title}")
        return None

    def _build_image_prompt(self, title: str, content: str) -> str:
        """Build image generation prompt"""
        content_preview = content[:500].lower()

        if 'cricket' in content_preview or 'ipl' in content_preview:
            base_theme = "cricket stadium with players, vibrant Indian atmosphere"
        elif 'casino' in content_preview or 'poker' in content_preview:
            base_theme = "modern casino with card games, elegant setting"
        else:
            base_theme = "digital gaming interface, sports betting elements"

        return f'''Professional blog cover image for: "{title}"

Style: Modern, vibrant colors suitable for Indian audience
Elements: {base_theme}, subtle Dogplay branding
Composition: Clean, text-overlay friendly
Mood: Professional, exciting, trustworthy
Quality: High resolution, photorealistic

Include: Visual elements that represent betting/gaming, Indian cultural touches, bright but professional color scheme with greens and golds.'''


class ContentPublisher:
    """Handles content file creation and Git operations"""

    def __init__(self, config: Config):
        self.config = config
        self.content_dir = Path(config.content_dir)
        self.ops_dir = Path(config.ops_dir)

        # Ensure directories exist
        self.content_dir.mkdir(parents=True, exist_ok=True)
        self.ops_dir.mkdir(parents=True, exist_ok=True)

    def check_duplicate(self, article: Dict[str, Any]) -> bool:
        """Check if article is too similar to existing content"""
        # Calculate hash of article content
        content_hash = hashlib.md5(
            article['content'].encode()
        ).hexdigest()

        # Check against existing articles
        for existing_file in self.content_dir.glob('**/*.md'):
            with open(existing_file, 'r', encoding='utf-8') as f:
                existing_content = f.read()
                existing_hash = hashlib.md5(existing_content.encode()).hexdigest()

                if content_hash == existing_hash:
                    logger.info(f"Duplicate content detected, skipping: {article['title']}")
                    return True

        return False

    def assess_quality(self, article: Dict[str, Any]) -> tuple[bool, str]:
        """
        Assess if content meets quality threshold for indexing

        Returns:
            (should_index, reason)
        """
        # Word count check
        if article['word_count'] < self.config.min_word_count:
            return False, f"Below word count threshold: {article['word_count']}"

        # Source availability check
        if not article.get('sources') or len(article['sources']) < 1:
            return False, "No sources provided"

        # Content uniqueness (basic check)
        if len(article['content']) < 500:
            return False, "Content too brief"

        return True, "Meets quality standards"

    def publish_article(
        self,
        article: Dict[str, Any],
        image_url: Optional[str] = None
    ) -> str:
        """
        Publish article as Markdown file

        Returns:
            File path
        """
        should_index, quality_reason = self.assess_quality(article)

        # Determine directory based on indexability
        if should_index:
            article_dir = self.content_dir / article['slug']
        else:
            article_dir = self.ops_dir / 'low-quality' / article['slug']

        article_dir.mkdir(parents=True, exist_ok=True)

        # Create frontmatter
        frontmatter = {
            'title': article['title'],
            'slug': article['slug'],
            'excerpt': article['excerpt'],
            'date': article['date'],
            'language': article['language'],
            'category': article.get('category', 'iGaming'),
            'seo': {
                'title': article.get('seo_title', article['title']),
                'description': article.get('seo_description', article['excerpt']),
            },
            'sources': article.get('sources', []),
            'cover_image': image_url,
            'should_index': should_index,
            'quality_note': quality_reason,
        }

        # Create Markdown file
        md_content = f"""---
{json.dumps(frontmatter, indent=2, ensure_ascii=False)}
---

{article['content']}
"""

        file_path = article_dir / 'index.mdx'
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(md_content)

        logger.info(f"Published article: {file_path}")
        return str(file_path)

    def publish_ops_brief(self, articles: List[Dict[str, Any]]) -> str:
        """Publish operations brief in Traditional Chinese"""
        brief_content = f"""# Daily Content Brief - {datetime.now().strftime('%Y-%m-%d')}

## Generated Articles

"""
        for article in articles:
            brief_content += f"""
### {article['title']}

- **Language**: {article['language']}
- **Category**: {article.get('category', 'N/A')}
- **Word Count**: {article['word_count']}
- **Slug**: `{article['slug']}`
- **Status**: {'Indexed' if article.get('should_index') else 'No Index'}

**Excerpt**: {article['excerpt'][:200]}...
"""

        file_path = self.ops_dir / 'daily' / f"{datetime.now().strftime('%Y-%m-%d')}.md"
        file_path.parent.mkdir(parents=True, exist_ok=True)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(brief_content)

        return str(file_path)


class GitHubPublisher:
    """Handles Git operations for publishing content"""

    def __init__(self, config: Config):
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'token {config.github_token}',
            'Accept': 'application/vnd.github.v3+json',
        })

    def commit_and_push(
        self,
        files: List[str],
        commit_message: str
    ) -> bool:
        """
        Commit and push changes to GitHub

        Args:
            files: List of file paths that were created/modified
            commit_message: Git commit message

        Returns:
            Success status
        """
        try:
            # Get current repo info
            api_base = f"https://api.github.com/repos/{self.config.github_repo}"

            # Get default branch
            response = self.session.get(f"{api_base}")
            response.raise_for_status()
            default_branch = response.json()['default_branch']

            # Get latest commit SHA
            response = self.session.get(f"{api_base}/git/refs/heads/{default_branch}")
            response.raise_for_status()
            latest_sha = response.json()['object']['sha']

            # Create tree with new files
            tree_items = []
            for file_path in files:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Create blob
                response = self.session.post(
                    f"{api_base}/git/blobs",
                    json={'content': content, 'encoding': 'utf-8'}
                )
                response.raise_for_status()
                blob_sha = response.json()['sha']

                # Get relative path for tree
                relative_path = str(Path(file_path).relative_to(Path.cwd()))

                tree_items.append({
                    'path': relative_path,
                    'mode': '100644',
                    'type': 'blob',
                    'sha': blob_sha
                })

            # Create tree
            response = self.session.post(
                f"{api_base}/git/trees",
                json={'tree': tree_items, 'base_tree': latest_sha}
            )
            response.raise_for_status()
            tree_sha = response.json()['sha']

            # Create commit
            response = self.session.post(
                f"{api_base}/git/commits",
                json={
                    'message': commit_message,
                    'tree': tree_sha,
                    'parents': [latest_sha]
                }
            )
            response.raise_for_status()
            commit_sha = response.json()['sha']

            # Update reference
            response = self.session.patch(
                f"{api_base}/git/refs/heads/{default_branch}",
                json={'sha': commit_sha}
            )
            response.raise_for_status()

            logger.info(f"Successfully pushed commit: {commit_sha}")
            return True

        except requests.RequestException as e:
            logger.error(f"GitHub API error: {e}")
            return False


def main():
    """Main execution function"""
    logger.info("Starting daily content generation...")

    # Load configuration
    config = Config.from_env()

    if not config.validate():
        logger.error("Invalid configuration. Please check environment variables.")
        sys.exit(1)

    # Initialize clients
    brave_client = BraveSearchClient(config.brave_search_api_key)
    llm_client = ChutesLLMClient(config.chutes_llm_api_key)
    image_client = ChutesImageClient(config.chutes_image_api_key)
    publisher = ContentPublisher(config)
    github_pub = GitHubPublisher(config)

    # Search keywords from PRD
    search_keywords = [
        'India iGaming news',
        'Cricket betting updates',
        'Online casino regulation India',
        'IPL betting news',
        'Indian sports betting',
    ]

    # Collect all news
    all_news = []
    for keyword in search_keywords[:3]:  # Use top 3 keywords
        news = brave_client.search_news(keyword, max_results=5)
        all_news.extend(news)

    if not all_news:
        logger.warning("No news articles found. Exiting.")
        sys.exit(0)

    logger.info(f"Total news articles collected: {len(all_news)}")

    # Select top relevant articles
    selected_news = all_news[:5]

    # Generate articles in multiple languages
    generated_articles = []
    published_files = []

    for language in ['en', 'hi', 'zh']:
        try:
            article = llm_client.generate_article(selected_news, language)

            # Check for duplicates
            if publisher.check_duplicate(article):
                continue

            # Generate cover image
            image_url = None
            if language in ['en', 'hi']:  # Only generate for main languages
                image_url = image_client.generate_cover_image(
                    article['title'],
                    article['excerpt']
                )

            # Publish article
            file_path = publisher.publish_article(article, image_url)
            published_files.append(file_path)
            generated_articles.append(article)

            logger.info(f"Generated {language} article: {article['title']}")

        except Exception as e:
            logger.error(f"Failed to generate {language} article: {e}")
            continue

    if not generated_articles:
        logger.warning("No articles generated. Exiting.")
        sys.exit(0)

    # Publish ops brief
    brief_path = publisher.publish_ops_brief(generated_articles)
    published_files.append(brief_path)

    # Commit to GitHub
    if config.github_token and config.github_repo:
        commit_message = f"chore: daily content update {datetime.now().strftime('%Y-%m-%d')}"
        github_pub.commit_and_push(published_files, commit_message)

    logger.info("Daily content generation completed successfully!")


if __name__ == '__main__':
    main()
