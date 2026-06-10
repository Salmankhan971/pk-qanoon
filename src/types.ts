/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ur';

export type LegalDomain =
  | 'family'
  | 'property'
  | 'cybercrime'
  | 'criminal'
  | 'civil'
  | 'consumer'
  | 'labour'
  | 'general';

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  domain?: LegalDomain;
  // Parsed structured elements if any (provided by client or extracted from AI response)
  status?: 'sending' | 'success' | 'error';
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  domain?: LegalDomain;
}

export interface LegalTopic {
  id: LegalDomain;
  title: { en: string; ur: string };
  iconName: string;
  description: { en: string; ur: string };
  laws: { en: string[]; ur: string[] };
  templates: {
    title: { en: string; ur: string };
    prompt: { en: string; ur: string };
  }[];
}

export interface DictionaryEntry {
  id: string;
  term: { en: string; ur: string };
  meaning: { en: string; ur: string };
  context: { en: string; ur: string };
}
