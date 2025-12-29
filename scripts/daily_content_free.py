#!/usr/bin/env python3
"""
Daily News Content Generator - FREE VERSION
Uses free APIs: Hugging Face + DuckDuckGo/NewsAPI
"""

import os
import json
import logging
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional, Any
from dataclasses import dataclass

import requests

# Configuration
@dataclass
class FreeConfig:
    """Configuration for free APIs"""
    huggingface_api_key: str = ""
    newsapi_api_key: = ""  # Optional: get from https://newsapi.org/
    content_dir: str = "src/content/posts"
    ops_dir: str = "src/content/ops"
    min_word_count: int = 300

    @classmethod
    def from_env(cls) -> 'FreeConfig':
        return cls(
            huggingface_api_key=os.getenv('HUGGINGFACE_API_KEY', ''),
            newsapi_api_key=os.getenv('NEWSAPI_API_KEY', ''),
        )

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class DuckDuckGoSearchClient:
    """Free search using DuckDuckGo HTML scraping"""

    def search_news(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Search news using DuckDuckGo"""
        try:
            url = "https://html.duckduckgo.com/html/"
            params = {'q': f'{query} news'}
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }

            response = requests.post(url, data=params, headers=headers, timeout=30)
            response.raise_for_status()

            import html
            from html.parser import HTMLParser

            class ResultParser(HTMLParser):
                def __init__(self):
                    super().__init__()
                    self.results = []
                    self.in_result = False
                    self.current_data = {}
                    self.text_parts = []

                def handle_starttag(self, tag, attrs):
                    attrs_dict = dict(attrs)
                    if tag == 'a' and 'result__a' in attrs_dict.get('class', ''):
                        self.in_result = True
                        self.current_data = {'url': attrs_dict.get('href', '')}
                    elif tag == 'a' and self.in_result:
                        link = attrs_dict.get('href', '')
                        if link and not link.startswith('#'):
                            self.current_data['url'] = link

                def handle_data(self, data):
                    if self.in_result:
                        text = data.strip()
                        if text:
                            self.text_parts.append(text)

                def handle_endtag(self, tag):
                    if tag == 'a' and self.in_result:
                        self.in_result = False
                        if self.text_parts:
                            self.current_data['title'] = ' '.join(self.text_parts)
                            if self.current_data.get('title') and self.current_data.get('url'):
                                self.current_data['snippet'] = self.current_data['title']
                                self.current_data['source'] = 'DuckDuckGo'
                                self.current_data['published_date'] = datetime.now().isoformat()
                                self.results.append(self.current_data)
                        self.current_data = {}
                        self.text_parts = []

            parser = ResultParser()
            parser.feed(response.text)

            logger.info(f"Found {len(parser.results)} results for: {query}")
            return parser.results[:max_results]

        except Exception as e:
            logger.error(f"DuckDuckGo search error: {e}")
            return []


class NewsAPIClient:
    """Alternative: NewsAPI.org (free tier: 100 requests/day)"""

    BASE_URL = "https://newsapi.org/v2"

    def __init__(self, api_key: str = ""):
        self.api_key = api_key

    def search_news(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Search news using NewsAPI"""
        if not self.api_key:
            logger.warning("NewsAPI key not provided, skipping")
            return []

        try:
            url = f"{self.BASE_URL}/everything"
            params = {
                'q': query,
                'language': 'en',
                'sortBy': 'publishedAt',
                'pageSize': max_results,
                'apiKey': self.api_key
            }

            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()

            data = response.json()
            articles = []

            for item in data.get('articles', []):
                articles.append({
                    'title': item.get('title', ''),
                    'url': item.get('url', ''),
                    'snippet': item.get('description', ''),
                    'published_date': item.get('publishedAt'),
                    'source': item.get('source', {}).get('name', 'Unknown'),
                })

            logger.info(f"NewsAPI found {len(articles)} articles for: {query}")
            return articles

        except Exception as e:
            logger.error(f"NewsAPI error: {e}")
            return []


class HuggingFaceLLMClient:
    """Free LLM using Hugging Face Inference API"""

    # Free models that work well without API key
    MODELS = {
        'small': 'mistralai/Mistral-7B-Instruct-v0.2',
        'medium': 'Qwen/Qwen2.5-72B-Instruct',
        'fast': 'microsoft/Phi-3-mini-4k-instruct',
    }

    def __init__(self, api_key: str = ""):
        self.api_key = api_key
        self.model = self.MODELS['fast']  # Use fast model by default
        self.session = requests.Session()

    def generate_article(
        self,
        news_items: List[Dict[str, Any]],
        language: str = 'en'
    ) -> Dict[str, Any]:
        """Generate article using Hugging Face"""
        prompts = self._get_prompts(language)

        # Build context
        news_context = "\n\n".join([
            f"- {item['title']}: {item.get('snippet', item['title'])}\n  Source: {item['source']}\n  URL: {item['url']}"
            for item in news_items[:3]
        ])

        try:
            user_prompt = f"{prompts['user']}\n\nNews Sources:\n{news_context}\n\nPlease write the article now."

            # Use Hugging Face Inference API
            api_url = f"https://api-inference.huggingface.co/models/{self.model}"

            headers = {}
            if self.api_key:
                headers['Authorization'] = f"Bearer {self.api_key}"

            payload = {
                "inputs": f"<|system|>\n{prompts['system']}\n<|user|>\n{user_prompt}\n<|assistant|>\n\nArticle in JSON format:\n{{\n  \"title\": \"...\",\n  \"excerpt\": \"...\",\n  \"content\": \"...\",\n  \"seo_title\": \"...\",\n  \"seo_description\": \"...\",\n  \"category\": \"Cricket\",\n  \"sources\": []\n}}",
                "parameters": {
                    "max_new_tokens": 1500,
                    "temperature": 0.7,
                    "return_full_text": False,
                }
            }

            response = self.session.post(api_url, headers=headers, json=payload, timeout=60)

            if response.status_code == 401:
                # Try without auth (free tier)
                del headers['Authorization']
                response = self.session.post(api_url, headers=headers, json=payload, timeout=60)

            response.raise_for_status()
            result = response.json()

            # Parse response
            if isinstance(result, list):
                content = result[0].get('generated_text', '')
            else:
                content = result.get('generated_text', '')

            # Extract JSON from response
            article = self._parse_article_response(content, news_items, language)
            return article

        except Exception as e:
            logger.error(f"HuggingFace API error: {e}")
            raise

    def _get_prompts(self, language: str) -> Dict[str, str]:
        if language == 'en':
            return {
                'system': '''You are a professional content writer for an Indian betting affiliate website called "Dogplay Agent".

Your task: Write engaging blog articles based on provided news sources.

REQUIREMENTS:
1. Include all source URLs in the article
2. Write naturally about iGaming/cricket betting in India
3. Mention "Dogplay Agent" as a reliable betting partner
4. Target 400-600 words
5. Use clear headings and structure

OUTPUT FORMAT (JSON):
{
  "title": "Article title",
  "excerpt": "Brief summary (150 chars)",
  "content": "Full article in HTML format with <h2>, <p>, <ul> tags",
  "seo_title": "SEO title (60 chars)",
  "seo_description": "Meta description (160 chars)",
  "category": "Cricket or iGaming",
  "sources": ["Source 1 URL", "Source 2 URL"]
}''',
                'user': 'Write an article about the latest cricket/iGaming news in India.'
            }
        else:
            # Hindi
            return {
                'system': '''आप एक पेशेवर कंटेंट राइटर हैं जो भारतीय बेटिंग एफिलिएट वेबसाइट "Dogplay एजेंट" के लिए लिखते हैं।

आवश्यकताएं:
1. लेख में सभी स्रोत URLs शामिल करें
2. भारत में iGaming/क्रिकेट बेटिंग के बारे में स्वाभाविक रूप से लिखें
3. "Dogplay एजेंट" को एक विश्वसनीय बेटिंग पार्टनर के रूप में उल्लेख करें
4. 400-600 शब्द लक्ष्य
5. स्पष्ट शीर्षक और संरचना का उपयोग करें

JSON आउटपुट फॉर्मेट में लिखें।''',
                'user': 'भारत में नवीनतम क्रिकेट/iGaming समाचार पर एक लेख लिखें।'
            }

    def _parse_article_response(
        self,
        content: str,
        news_items: List[Dict[str, Any]],
        language: str
    ) -> Dict[str, Any]:
        """Parse LLM response"""
        try:
            # Try to extract JSON from response
            json_match = re.search(r'\{[\s\S]*?\}', content)
            if json_match:
                article_data = json.loads(json_match.group())
            else:
                # Fallback: create from text
                article_data = {
                    'title': f"Cricket & iGaming Updates - {datetime.now().strftime('%B %d, %Y')}",
                    'excerpt': content[:150] + '...',
                    'content': content,
                    'seo_title': f"Cricket & iGaming Updates - {datetime.now().strftime('%B %d')}",
                    'seo_description': content[:160],
                    'category': 'iGaming',
                    'sources': [item['url'] for item in news_items],
                }

            # Add metadata
            slug = self._generate_slug(article_data.get('title', 'article'), language)
            article_data.update({
                'slug': slug,
                'language': language,
                'date': datetime.now().isoformat(),
                'sources': list(set(article_data.get('sources', []) + [item['url'] for item in news_items])),
                'word_count': len(article_data.get('content', '').split()),
            })

            return article_data

        except Exception as e:
            logger.error(f"Failed to parse article: {e}")
            # Return minimal article
            return {
                'title': f"Daily Update - {datetime.now().strftime('%Y-%m-%d')}",
                'excerpt': 'Latest cricket and iGaming news from India.',
                'content': f'<p>Latest updates from the world of cricket and iGaming in India.</p>',
                'slug': f"daily-update-{datetime.now().strftime('%Y-%m-%d')}",
                'language': language,
                'date': datetime.now().isoformat(),
                'category': 'iGaming',
                'sources': [item['url'] for item in news_items],
                'word_count': 20,
            }

    def _generate_slug(self, title: str, language: str) -> str:
        """Generate URL-safe slug"""
        slug = title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        slug = slug.strip('-')[:50]
        date_prefix = datetime.now().strftime('%Y-%m-%d')
        return f"{date_prefix}-{slug}"


class ContentPublisher:
    """Handles content file creation"""

    def __init__(self, config: FreeConfig):
        self.config = config
        self.content_dir = Path(config.content_dir)
        self.ops_dir = Path(config.ops_dir)

        # Ensure directories exist
        self.content_dir.mkdir(parents=True, exist_ok=True)
        self.ops_dir.mkdir(parents=True, exist_ok=True)

    def assess_quality(self, article: Dict[str, Any]) -> tuple[bool, str]:
        """Check if content meets quality threshold"""
        if article['word_count'] < self.config.min_word_count:
            return False, f"Below word count threshold: {article['word_count']}"
        if not article.get('sources'):
            return False, "No sources provided"
        return True, "Meets quality standards"

    def publish_article(self, article: Dict[str, Any]) -> str:
        """Publish article as Markdown file"""
        should_index, _ = self.assess_quality(article)

        if should_index:
            article_dir = self.content_dir / article['slug']
        else:
            article_dir = self.ops_dir / 'low-quality' / article['slug']

        article_dir.mkdir(parents=True, exist_ok=True)

        # Create frontmatter
        frontmatter = {
            'title': article['title'],
            'slug': article['slug'],
            'excerpt': article.get('excerpt', ''),
            'date': article['date'],
            'language': article['language'],
            'category': article.get('category', 'iGaming'),
            'seo': {
                'title': article.get('seo_title', article['title']),
                'description': article.get('seo_description', article.get('excerpt', '')),
            },
            'sources': article.get('sources', []),
            'should_index': should_index,
        }

        # Create Markdown
        md_content = f"""---
{json.dumps(frontmatter, indent=2, ensure_ascii=False)}
---

{article.get('content', '')}

---

## Sources
"""
        for source in article.get('sources', []):
            md_content += f"- [{source}]({source})\n"

        file_path = article_dir / 'index.mdx'
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(md_content)

        logger.info(f"Published: {file_path}")
        return str(file_path)


def main():
    """Main execution function"""
    logger.info("Starting free content generation...")

    # Load config
    config = FreeConfig.from_env()

    # Initialize clients
    ddg_client = DuckDuckGoSearchClient()
    newsapi_client = NewsAPIClient(config.newsapi_api_key)
    llm_client = HuggingFaceLLMClient(config.huggingface_api_key)
    publisher = ContentPublisher(config)

    # Search for news
    keywords = ['cricket India', 'IPL 2025', 'India sports betting']

    all_news = []
    for keyword in keywords[:2]:
        # Try NewsAPI first, fallback to DuckDuckGo
        news = newsapi_client.search_news(keyword, max_results=3)
        if not news:
            news = ddg_client.search_news(keyword, max_results=3)
        all_news.extend(news)

    if not all_news:
        logger.warning("No news found. Creating fallback article.")
        all_news = [{
            'title': 'Cricket and iGaming in India',
            'url': 'https://dogplay.io',
            'snippet': 'Cricket and iGaming continue to grow in popularity across India.',
            'source': 'Dogplay',
            'published_date': datetime.now().isoformat(),
        }]

    logger.info(f"Total news items: {len(all_news)}")

    # Generate articles
    generated_articles = []
    for language in ['en']:
        try:
            article = llm_client.generate_article(all_news[:3], language)
            file_path = publisher.publish_article(article)
            generated_articles.append(article)
            logger.info(f"Generated {language} article: {article['title']}")
        except Exception as e:
            logger.error(f"Failed to generate article: {e}")
            continue

    logger.info(f"Content generation complete! {len(generated_articles)} articles created.")


if __name__ == '__main__':
    main()
