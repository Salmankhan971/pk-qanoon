/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LegalTopic, DictionaryEntry } from './types';

export const LEGAL_TOPICS: LegalTopic[] = [
  {
    id: 'family',
    title: { en: 'Family Law', ur: 'خاندانی قوانین' },
    iconName: 'Users',
    description: {
      en: 'Guidance on marriage, divorce (Talaq & Khula), child custody (Hizanat), maintenance (Nafqah), dower (Mehr), and inheritance.',
      ur: 'نکاح، طلاق (طلاق اور خلع)، بچوں کی حضانت، نفقہ (خرچہ)، مہر اور وراثت سے متعلق رہنمائی۔',
    },
    laws: {
      en: [
        'Muslim Family Laws Ordinance, 1961 (MFLO)',
        'Dissolution of Muslim Marriages Act, 1939',
        'Guardians and Wards Act, 1890',
        'Family Courts Act, 1964',
      ],
      ur: [
        'مسلم فیملی لاذ آرڈیننس، 1961',
        'قانون تنسیخ نکاحِ مسلمانان، 1939',
        'گارڈینز اینڈ وارڈز ایکٹ، 1890',
        'فیملی کورٹس ایکٹ، 1964',
      ],
    },
    templates: [
      {
        title: { en: 'What is the procedure for a wife to obtain a Khula?', ur: 'بیوی کے خلع حاصل کرنے کا طریقہ کار کیا ہے؟' },
        prompt: {
          en: 'What is the complete legal procedure for a wife to obtain a Khula (judicial divorce) in Pakistan? Please explain the role of Family Courts, Mehr return rules, and the expected timeframe.',
          ur: 'پاکستان میں بیوی کے لیے خلع (عدالتی طلاق) حاصل کرنے کا مکمل قانونی طریقہ کار کیا ہے؟ فیملی کورٹ کے کردار، مہر کی واپسی کے اصول اور متوقع وقت کی وضاحت کریں۔',
        },
      },
      {
        title: { en: 'Rules for child custody (Hizanat) for a mother', ur: 'ماں کے لیے بچوں کی حضانت (حفاظت) کے اصول' },
        prompt: {
          en: 'According to Pakistani law, under what conditions is a mother given custody (Hizanat) of minor children? At what age does custody change for boys and girls, and how are father\'s visitation rights managed?',
          ur: 'پاکستانی قانون کے مطابق کن شرائط پر ماں کو نابالغ بچوں کی حضانت دی جاتی ہے؟ لڑکوں اور لڑکیوں کے لیے کس عمر میں حضانت تبدیل ہوتی ہے، اور باپ کی ملاقات کے حقوق کیسے طے پاتے ہیں؟',
        },
      },
      {
        title: { en: 'Filing for wife and children maintenance (Nafqah)', ur: 'بیوی اور بچوں کے نفقے (خرچے) کا دعویٰ' },
        prompt: {
          en: 'If a husband refuses to provide maintenance, how can a wife file a legal claim for maintenance (Nafqah) for herself and her children in Pakistan? What laws govern this?',
          ur: 'اگر شوہر نفقہ (خرچہ) دینے سے انکار کرے، تو بیوی اپنے اور اپنے بچوں کے نفقے کے لیے پاکستان میں قانونی دعویٰ کیسے دائر کر سکتی ہے؟ اس کے تحت کون سے قوانین لاگو ہوتے ہیں؟',
        },
      },
    ],
  },
  {
    id: 'property',
    title: { en: 'Property & Land Law', ur: 'جائیداد اور اراضی کے قوانین' },
    iconName: 'Home',
    description: {
      en: 'Information on property transfer, landlord-tenant disputes, illegal occupation (Qabza), inheritances division, and land registries.',
      ur: 'منتقلیِ جائیداد، مالک مکان اور کرایہ دار کے تنازعات، ناجائز قبضہ (قبضہ گروپ)، وراثت کی تقسیم اور اراضی رجسٹری کے بارے میں معلومات۔',
    },
    laws: {
      en: [
        'Transfer of Property Act, 1882',
        'Land Revenue Act, 1967',
        'Illegal Dispossession Act, 2005',
        'Provincial Rented Premises Acts',
      ],
      ur: [
        'قانون منتقلیِ جائیداد، 1882',
        'لینڈ ریونیو ایکٹ، 1967',
        'غیر قانونی بے دخلی ایکٹ، 2005',
        'صوبائی کرایہ داری ایکٹ',
      ],
    },
    templates: [
      {
        title: { en: 'Remedy against illegal property occupation (Qabza)', ur: 'جائیداد پر غیر قانونی قابضین (قبضہ) کے خلاف حل' },
        prompt: {
          en: 'My property has been illegally occupied by land grabbers (Qabza group) in Pakistan. What are my immediate remedies under the Illegal Dispossession Act, 2005 and the Specific Relief Act (Section 9)?',
          ur: 'پاکستان میں میری جائیداد پر بااثر افراد نے غیر قانونی قبضہ کر لیا ہے۔ غیر قانونی بے دخلی ایکٹ 2005 اور سپیسیفک ریلیف ایکٹ (سیکشن 9) کے تحت میرے پاس کون سے فوری قانونی حل موجود ہیں؟',
        },
      },
      {
        title: { en: 'Process to divide inheritance among heirs', ur: 'وارثوں کے درمیان وراثت کی تقسیم کا طریقہ کار' },
        prompt: {
          en: 'How is a deceased relative\'s property divided among legal heirs in Pakistan? What is the process of obtaining a Succession Certificate and a Partition Deed?',
          ur: 'پاکستان میں وفات پا جانے والے رشتہ دار کی جائیداد قانونی وارثوں کے درمیان کیسے تقسیم ہوتی ہے؟ سکسیشن سرٹیفکیٹ (جانشینی سرٹیفکیٹ) اور تقسیم نامہ (Partition Deed) حاصل کرنے کا طریقہ کار کیا ہے؟',
        },
      },
      {
        title: { en: 'Tenant eviction rules and procedure', ur: 'کرایہ دار کی بے دخلی کے اصول اور طریقہ کار' },
        prompt: {
          en: 'I am a landlord. Under what conditions and through what legal process can I evict a tenant who refuses to pay rent under Pakistani provincial rented premises laws?',
          ur: 'میں مکان مالِک ہوں۔ کن شرائط اور کس قانونی طریقہ کار کے تحت میں کرایہ ادا نہ کرنے والے کرایہ دار کو بے دخل کر سکتا ہوں؟ صوبائی کرایہ داری قوانین کی روشنی میں بتائیں۔',
        },
      },
    ],
  },
  {
    id: 'cybercrime',
    title: { en: 'Cybercrime & Digital Rights', ur: 'سائبر کرائم اور ڈیجیٹل حقوق' },
    iconName: 'ShieldAlert',
    description: {
      en: 'Filing complaints under PECA for online harassment, blackmail, identity theft, financial fraud, and cyber defamation.',
      ur: 'آن لائن ہراساں کرنے، بلیک میلنگ، شناختی چوری، مالیاتی فراڈ اور انٹرنیٹ پر ہتکِ عزت کے خلاف پیکا (PECA) کے تحت شکایت درج کروانا۔',
    },
    laws: {
      en: [
        'Prevention of Electronic Crimes Act, 2016 (PECA)',
        'Pakistan Penal Code, 1860 (Relevant Defamation Sections)',
      ],
      ur: [
        'انسدادِ جرائمِ الیکٹرانک ایکٹ، 2016 (پیکا)',
        'تعزیراتِ پاکستان، 1860 (متعلقہ ہتکِ عزت دفعات)',
      ],
    },
    templates: [
      {
        title: { en: 'What to do in case of online blackmailing or extortion?', ur: 'آن لائن بلیک میلنگ یا بلیک میل کر کے پیسے مانگنے پر کیا کریں؟' },
        prompt: {
          en: 'Someone is blackmailing me online by threatening to leak private photos or personal data. How do I file a complaint with FIA Cyber Crime Wing under PECA 2016, and what protections does the law guarantee?',
          ur: 'کوئی شخص ذاتی تصاویر یا ڈیٹا لیک کرنے کی دھمکی دے کر مجھے بلیک میل کر رہا ہے۔ میں پیکا 2016 کے تحت ایف آئی اے (FIA) سائبر کرائم ونگ میں کیسے شکایت درج کلاسکتا ہوں اور قانون مجھے کیا تحفظات فراہم کرتا ہے؟',
        },
      },
      {
        title: { en: 'Remedy for online identity theft and fake accounts', ur: 'شناختی چوری اور جعلی سوشل میڈیا اکاؤنٹس کا علاج' },
        prompt: {
          en: 'A fake social media account has been created using my name and photographs to defame me. What action can I take under PECA 2016 (Section 20/21)?',
          ur: 'کسی نے مجھے بدنام کرنے کے لیے میرا نام اور تصاویر استعمال کر کے سوشل میڈیا پر جعلی اکاؤنٹ بنایا ہے۔ میں پیکا 2016 (دفعہ 20/21) کے تحت کیا کارروائی کر سکتا ہوں؟',
        },
      },
    ],
  },
  {
    id: 'criminal',
    title: { en: 'Criminal & Police Matters', ur: 'فوجداری اور پولیس کے معاملات' },
    iconName: 'ShieldAlert',
    description: {
      en: 'Registering an FIR, bail applications (pre-arrest & post-arrest), illegal detention, harassment, and police arrest rights.',
      ur: 'ایف آئی آر (FIR) کا اندراج، زمانت کی درخواستیں (قبل از گرفتاری اور بعد از گرفتاری)، غیر قانونی حراست اور پولیس گرفتاری کے حقوق۔',
    },
    laws: {
      en: [
        'Pakistan Penal Code, 1860 (PPC)',
        'Code of Criminal Procedure, 1898 (CrPC)',
        'Police Order, 2002',
      ],
      ur: [
        'تعزیراتِ پاکستان، 1860 (PPC)',
        'مجموعہ ضابطہ فوجداری، 1898 (CrPC)',
        'پولیس آرڈر، 2002',
      ],
    },
    templates: [
      {
        title: { en: 'How to register a First Information Report (FIR)?', ur: 'فرسٹ انفارمیشن رپورٹ (ایف آئی آر) کیسے درج کرائی جائے؟' },
        prompt: {
          en: 'What is the step-by-step legal procedure to register an FIR under Section 154 of CrPC in Pakistan? What should I do if the police officer refuses to register it?',
          ur: 'پاکستان میں مجموعہ ضابطہ فوجداری کے سیکشن 154 کے تحت ایف آئی آر درج کرانے کا مرحلہ وار قانونی طریقہ کار کیا ہے؟ اگر تھانے کا ایس ایچ او (SHO) اندراج سے انکار کرے تو کیا کرنا چاہیے؟',
        },
      },
      {
        title: { en: 'Difference between pre-arrest and post-arrest bail', ur: 'قبل از گرفتاری اور بعد از گرفتاری ضمانت میں فرق' },
        prompt: {
          en: 'Please explain the legal difference between "pre-arrest bail" (bail before arrest) and "post-arrest bail" under CrPC. What are the grounds on which a court grants bail in cognizable offences in Pakistan?',
          ur: 'ضابطہ فوجداری کے تحت "ضمانت قبل از گرفتاری" اور "ضمانت بعد از گرفتاری" میں کیا قانونی فرق ہے؟ پاکستان میں کن بنیادوں پر عدالت قابلِ دست اندازی جرائم میں ضمانت دیتی ہے؟',
        },
      },
      {
        title: { en: 'Rights of a citizen upon being stopped or arrested', ur: 'گرفتاری یا پولیس کے روکنے پر شہری کے حقوق' },
        prompt: {
          en: 'What are my constitutional and legal rights under the Constitution of Pakistan (Article 10) if I am detained, stopped, or arrested by the police? Within how much time must I be produced before a magistrate?',
          ur: 'اگر مجھے پولیس روکتی ہے یا گرفتار کرتی ہے، تو آئینِ پاکستان (آرٹیکل 10) کے تحت میرے آئینی اور قانونی حقوق کیا ہیں؟ مجھے کتنے وقت کے اندر مجسٹریٹ کے سامنے پیش کرنا لازمی ہے؟',
        },
      },
    ],
  },
  {
    id: 'civil',
    title: { en: 'Civil Law & Contracts', ur: 'دیوانی قوانین اور معاہدے' },
    iconName: 'FileText',
    description: {
      en: 'Drafting contracts, recovery of money, breach of agreements, partition of joint family assets, and civil suits.',
      ur: 'معاہدوں کی تحریر، رقم کی وصولیابی، معاہدے کی خلاف ورزی، مشترکہ خاندانی جائیداد کا بٹوارہ اور دیگر دیوانی دعوے۔',
    },
    laws: {
      en: [
        'Civil Procedure Code, 1908 (CPC)',
        'Contract Act, 1872',
        'Specific Relief Act, 1877',
        'Limitation Act, 1908',
      ],
      ur: [
        'ضابطہ دیوانی، 1908 (CPC)',
        'ایکٹ معاہدات، 1872',
        'سپیسیفک ریلیف ایکٹ، 1877',
         'قانونِ میعاد سماعت، 1908',
      ],
    },
    templates: [
      {
        title: { en: 'Remedy for breach of a written agreement', ur: 'تحریری معاہدے کی خلاف ورزی کا علاج' },
        prompt: {
          en: 'I entered into a commercial agreement, and the other party broke the contract, causing major financial loss. What are my remedies for breach of contract and recovery of damages under the Contract Act, 1872 and Specific Relief Act in Pakistan?',
          ur: 'میں نے تجارتی معاہدہ کیا تھا لیکن دوسری پارٹی نے وعدہ خلافی کر کے مجھے بڑا مالی نقصان پہنچایا۔ ایکٹ معاہدات، 1872 کے تحت ہرجانے کی وصولی کے لیے میرے پاس کیا قانونی چارہ جوئی دستیاب ہے؟',
        },
      },
      {
        title: { en: 'How to recover loaned money legally?', ur: 'ادھار دی ہوئی رقم قانونی طور پر کیسے وصول کی جائے؟' },
        prompt: {
          en: 'I loaned money to someone, and they have a written acknowledgement (cheque or agreement) but are refusing to pay back. How do I file a recovery suit (Order 37 CPC) under Pakistani civil laws?',
          ur: 'میں نے کسی کو ادھار دیا تھا، ان کا معاہدہ یا چیک میرے پاس ہے مگر وہ اب واپس کرنے سے انکاری ہیں۔ پاکستانی دیوانی قوانین کے تحت آرڈر 37 (Order 37 CPC) کے تحت وصولی کا دعویٰ کیسے دائر کروں؟',
        },
      },
    ],
  },
  {
    id: 'consumer',
    title: { en: 'Consumer Protection', ur: 'صارفین کا تحفظ' },
    iconName: 'ShoppingBag',
    description: {
      en: 'Filing complaints in Consumer Courts for defective products, sub-standard services, and misleading advertising.',
      ur: ' ناقص مصنوعات، غیر معیاری خدمات اور گمراہ کن اشتہارات کے خلاف صارف عدالتوں (Consumer Courts) میں دعویٰ دائر کرنا۔',
    },
    laws: {
      en: [
        'Provincial Consumer Protection Acts (e.g. Punjab Consumer Protection Act, 2005)',
      ],
      ur: [
        'صوبائی قوانینِ تحفظِ صارفین (مثلاً پنجاب تحفظِ صارفین ایکٹ، 2005)',
      ],
    },
    templates: [
      {
        title: { en: 'How to file a claim in Consumer Court?', ur: 'صارف عدالت میں کیس دائر کرنے کا طریقہ' },
        prompt: {
          en: 'I purchased a defective product or received terrible service from a business, and they refused to refund. What is the exact process of sending a Send Legal 15-day Notice and filing a written claim in the Consumer Court in Pakistan?',
          ur: 'میں نے ایک ناقص پروڈکٹ خریدی یا خراب سروس لی مگر کمپنی واپس نہیں کر رہی۔ صارف عدالت (Consumer Court) میں دعویٰ دائر کرنے سے پہلے پندرہ روزہ قانونی نوٹس بھیجنے اور کیس دائر کرنے کا مکمل طریقہ کار کیا ہے؟',
        },
      },
    ],
  },
  {
    id: 'labour',
    title: { en: 'Labour & Employment', ur: 'ملازمین اور محنت کشوں کے حقوق' },
    iconName: 'Briefcase',
    description: {
      en: 'Employees rights against wrongful dismissal, delayed wages, gratuity/provident funds, and work safety.',
      ur: 'غیر قانونی برطرفی، تنخواہ میں بلاوجہ تاخیر، گریجویٹی، پروویڈنٹ فنڈز اور کام کے مقامات پر ملازمین کے قانونی تحفظات اور حقوق۔',
    },
    laws: {
      en: [
        'Industrial and Commercial Employment (Standing Orders) Ordinance, 1968',
        'Payment of Wages Act, 1936',
        'Workmen\'s Compensation Act, 1923',
      ],
      ur: [
        'صنعتی اور تجارتی روزگار (اسٹینڈنگ آرڈرز) آرڈیننس، 1968',
        'قانون ادائیگیِ اجرت، 1936',
        'ورک مین کمپی نسی شن ایکٹ، 1923',
      ],
    },
    templates: [
      {
        title: { en: 'What is the remedy for wrongful termination?', ur: 'غیر قانونی برطرفی کا علاج کیا ہے؟' },
        prompt: {
          en: 'My employer suddenly terminated my employment without any prior written notice or giving redundancy/gratuity benefits. What is my legal remedy in the Labour Court under the Standing Orders Ordinance 1968?',
          ur: 'میرے آجر (کمپنی/مالک) نے بغیر تحریری نوٹس یا گریجویٹی واجبات دیئے بغیر مجھے ملازمت سے اچانک فارغ کر دیا ہے۔ اسٹینڈنگ آرڈرز آرڈیننس 1968 کے تحت لیبر کورٹ میں دائر شکایت کا کیا طریقہ کار ہے؟',
        },
      },
    ],
  },
];

export const DICTIONARY_ENTRIES: DictionaryEntry[] = [
  {
    id: 'fir',
    term: { en: 'FIR (First Information Report)', ur: 'ایف آئی آر (فرسٹ انفارمیشن رپورٹ)' },
    meaning: {
      en: 'The initial report filed to the police about the occurrence of a cognizable offence.',
      ur: 'کسی قابلِ دست اندازیِ پولیس جرم کے وقوع پذیر ہونے کے بارے میں پولیس کے پاس درج کرائی جانے والی ابتدائی رپورٹ۔',
    },
    context: {
      en: 'Governed by Section 154 of the Criminal Procedure Code (CrPC) 1898. It sets the criminal justice system in motion.',
      ur: 'ضابطہ فوجداری (CrPC) 1898 کی دفعہ 154 کے تحت درج ہوتی ہے۔ اس سے فوجداری نظام حرکت میں آتا ہے۔',
    },
  },
  {
    id: 'khula',
    term: { en: 'Khula', ur: 'خلع' },
    meaning: {
      en: 'A Muslim woman\'s right to dissolve her marriage through a decree issued by a Family Court.',
      ur: 'مسلمان عورت کا وہ شرعی و قانونی حق جس کے ذریعے وہ فیملی کورٹ (عدالت) سے شوہر سے علیحدگی ڈگری حاصل کرتی ہے۔',
    },
    context: {
      en: 'Governed by the Family Courts Act 1964 and Dissolution of Muslim Marriages Act 1939. This typically requires sacrificing her dower (Mehr).',
      ur: 'فیملی کورٹس ایکٹ 1964 اور تنسیخ نکاحِ مسلمانان ایکٹ 1939 کے تحت کارروائی ہوتی ہے۔ عام طور پر بیوی کو حقِ مہر واپس کرنا پڑتا ہے۔',
    },
  },
  {
    id: 'mehr',
    term: { en: 'Mehr (Dower)', ur: 'حقِ مہر' },
    meaning: {
      en: 'A mandatory payment or property given by the groom to the bride in a Muslim marriage contract.',
      ur: 'مسلم نکاح کے وقت دولہا کی طرف سے دلہن کو دیا جانے والا وہ واجب الادا مال یا رقم جو دلہن کا اپنا خصوصی حق ہوتا ہے۔',
    },
    context: {
      en: 'Can be "Prompt" (payable immediately upon marriage) or "Deferred" (payable upon divorce/death or as agreed). Promoted by the Muslim Family Laws Ordinance 1961.',
      ur: 'یہ معجل (فوری قابلِ ادائیگی) یا غیر معجل (مؤخر - طلاق یا موت پر قابلِ ادائیگی) ہوتا ہے۔ مسلم فیملی لاذ آرڈیننس 1961 اس کا تحفظ کرتا ہے۔',
    },
  },
  {
    id: 'qabza',
    term: { en: 'Qabza (Illegal Dispossession)', ur: 'قبضہ / غیر قانونی بے دخلی' },
    meaning: {
      en: 'Direct unlawful land or property grabbing without legal authority or land registration.',
      ur: 'بغیر کسی قانونی اختیار یا اراضی رجسٹری کے کسی کی اراضی یا جائیداد پر زبردستی یا غیر قانونی طریقے سے تسلط قائم کرنا۔',
    },
    context: {
      en: 'Addressed under the Illegal Dispossession Act, 2005. Offenders face up to 10 years of imprisonment, and special property courts handle these fast-track cases.',
      ur: 'اس کا تدارک غیر قانونی بے دخلی ایکٹ، 2005 کے تحت ہوتا ہے۔ اس میں مجرم کو 10 سال تک قید ہو سکتی ہے اور خصوصی عدالتیں فیصلے کرتی ہیں۔',
    },
  },
  {
    id: 'peca',
    term: { en: 'PECA (Prevention of Electronic Crimes Act)', ur: 'پیکا (انسدادِ جرائمِ الیکٹرانک ایکٹ)' },
    meaning: {
      en: 'Primary statutory framework in Pakistan to address internet crime, digital harrassments, financial phishing, and cyber safety.',
      ur: 'پاکستان میں انٹرنیٹ سے منسلک جرائم، بلیک میلنگ، آن لائن ہراسگی، اور ڈیجیٹل دھوکہ دہی سے نمٹنے کا بنیادی قانون۔',
    },
    context: {
      en: 'Passed in 2016. FIA (Federal Investigation Agency) Cyber Crime Wing is the sole designated inquiry body under this Act.',
      ur: 'یہ قانون 2016 میں نافذ ہوا۔ ایف آئی اے (FIA) سائبر کرائم ونگ اس کے تحت واحد نامزد تحقیقاتی ادارہ ہے۔',
    },
  },
  {
    id: 'nafqah',
    term: { en: 'Nafqah (Maintenance)', ur: 'نفقہ (خرچہ)' },
    meaning: {
      en: 'The legal duty of a husband/father to support his wife and children with basic necessities (food, shelter, clothing, medical).',
      ur: 'شوہر اور باپ کا وہ شرعی اور قانونی فریضہ کہ وہ اپنی بیوی اور بچوں کو رہائش، کھانا، لباس اور تعلیم جیسی بنیادی ضروریات فراہم کرے۔',
    },
    context: {
      en: 'Can be claimed via the Family Court under Section 9 of the Muslim Family Laws Ordinance, 1961 if a husband neglects his family.',
      ur: 'اگر شوہر غفلت برتے تو فیملی کورٹ میں مسلم فیملی لاذ آرڈیننس 1961 کے سیکشن 9 اور فیملی کورٹس ایکٹ 1964 کے تحت دعویٰ دائر کیا جا سکتا ہے۔',
    },
  },
  {
    id: 'hizanat',
    term: { en: 'Hizanat (Child Custody)', ur: 'حضانت' },
    meaning: {
      en: 'The physical keeping, safety, and up-bringing of a minor child when parents are separated.',
      ur: 'والدین کے الگ ہو جانے پر نابالغ بچے کی جسمانی پرورش، دیکھ بھال اور سکونت کا حقدار ہونا۔',
    },
    context: {
      en: 'Determined principally in the welfare of the ward under the Guardians and Wards Act, 1890. Generally, young age custody remains with the mother.',
      ur: 'اس کا فیصلہ گارڈینز اینڈ وارڈز ایکٹ 1890 کے تحت بچے کی فلاح و بہبود کو اولین ترجیح دے کر کیا جاتا ہے۔ بنیادی طور پر چھوٹی عمر میں یہ حق ماں کو ملتا ہے۔',
    },
  },
];
