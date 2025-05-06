import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Languages, 
  Mic, 
  Volume2, 
  X,
  Globe2,
  MessageCircle,
  RefreshCw,
  Send,
  Copy,
  Check,
  History,
  Loader2,
  User,
  Stethoscope,
  Video,
  Phone,
  Camera,
  Image,
  Paperclip,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Settings,
  HelpCircle,
  Info
} from 'lucide-react';

// Types
interface Message {
  id: string;
  text: string;
  translation: string;
  sender: 'patient' | 'doctor';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isAI?: boolean;
}

interface Participant {
  id: string;
  name: string;
  role: 'patient' | 'doctor';
  avatar: string;
  language: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

interface QuickPhrase {
  id: string;
  text: string;
  category: 'symptoms' | 'questions' | 'common' | 'emergency';
}

// Available languages
const availableLanguages: Language[] = [
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-PT', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' }
];

// Common medical phrases for quick access
const quickPhrases: Record<string, QuickPhrase[]> = {
  'fr-FR': [
    { id: 'headache-fr', text: "J'ai mal à la tête", category: 'symptoms' },
    { id: 'allergic-fr', text: "Je suis allergique à", category: 'common' },
    { id: 'hospital-fr', text: "Où est l'hôpital le plus proche ?", category: 'emergency' },
    { id: 'doctor-fr', text: "J'ai besoin d'un médecin", category: 'emergency' },
    { id: 'pain-fr', text: "J'ai une douleur ici", category: 'symptoms' },
    { id: 'fever-fr', text: "J'ai de la fièvre", category: 'symptoms' },
    { id: 'prescription-fr', text: "Avez-vous une ordonnance ?", category: 'questions' },
    { id: 'insurance-fr', text: "Acceptez-vous mon assurance ?", category: 'questions' }
  ],
  'en-US': [
    { id: 'headache-en', text: "I have a headache", category: 'symptoms' },
    { id: 'allergic-en', text: "I'm allergic to", category: 'common' },
    { id: 'hospital-en', text: "Where is the nearest hospital?", category: 'emergency' },
    { id: 'doctor-en', text: "I need a doctor", category: 'emergency' },
    { id: 'pain-en', text: "I have pain here", category: 'symptoms' },
    { id: 'fever-en', text: "I have a fever", category: 'symptoms' },
    { id: 'prescription-en', text: "Do you have a prescription?", category: 'questions' },
    { id: 'insurance-en', text: "Do you accept my insurance?", category: 'questions' }
  ],
  'es-ES': [
    { id: 'headache-es', text: "Me duele la cabeza", category: 'symptoms' },
    { id: 'allergic-es', text: "Soy alérgico a", category: 'common' },
    { id: 'hospital-es', text: "¿Dónde está el hospital más cercano?", category: 'emergency' },
    { id: 'doctor-es', text: "Necesito un médico", category: 'emergency' },
    { id: 'pain-es', text: "Tengo dolor aquí", category: 'symptoms' },
    { id: 'fever-es', text: "Tengo fiebre", category: 'symptoms' },
    { id: 'prescription-es', text: "¿Tiene una receta?", category: 'questions' },
    { id: 'insurance-es', text: "¿Acepta mi seguro?", category: 'questions' }
  ]
};

// Mock participants
const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    language: 'fr-FR',
    isOnline: true
  },
  {
    id: '2',
    name: 'John Smith',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=300&h=300',
    language: 'en-US',
    isOnline: true
  }
];

// Initial messages
const initialMessages: Message[] = [
  {
    id: '1',
    text: "Bonjour, comment puis-je vous aider aujourd'hui ?",
    translation: "Hello, how can I help you today?",
    sender: 'doctor',
    timestamp: new Date(Date.now() - 60000),
    status: 'read'
  },
  {
    id: '2',
    text: "I have a severe headache and fever since yesterday.",
    translation: "J'ai un mal de tête sévère et de la fièvre depuis hier.",
    sender: 'patient',
    timestamp: new Date(Date.now() - 30000),
    status: 'read'
  }
];

// AI suggestions based on context
const getAISuggestions = (messages: Message[], language: string): string[] => {
  // This would be powered by a real AI in production
  if (messages.length === 0) return [];
  
  const lastMessage = messages[messages.length - 1];
  
  if (language === 'fr-FR') {
    if (lastMessage.text.toLowerCase().includes('mal de tête') || lastMessage.translation.toLowerCase().includes('mal de tête')) {
      return [
        "Depuis combien de temps avez-vous mal à la tête ?",
        "Avez-vous pris des médicaments ?",
        "Avez-vous d'autres symptômes ?"
      ];
    } else if (lastMessage.text.toLowerCase().includes('fièvre') || lastMessage.translation.toLowerCase().includes('fièvre')) {
      return [
        "Quelle est votre température ?",
        "Avez-vous des frissons ?",
        "Avez-vous consulté un médecin ?"
      ];
    }
  } else if (language === 'en-US') {
    if (lastMessage.text.toLowerCase().includes('headache') || lastMessage.translation.toLowerCase().includes('headache')) {
      return [
        "How long have you had this headache?",
        "Have you taken any medication?",
        "Do you have any other symptoms?"
      ];
    } else if (lastMessage.text.toLowerCase().includes('fever') || lastMessage.translation.toLowerCase().includes('fever')) {
      return [
        "What is your temperature?",
        "Do you have chills?",
        "Have you seen a doctor?"
      ];
    }
  }
  
  return [];
};

export default function MedicalTranslator() {
  const navigate = useNavigate();
  const [view, setView] = useState<'translation' | 'conversation'>('conversation');
  const [sourceLanguage, setSourceLanguage] = useState('fr-FR');
  const [targetLanguage, setTargetLanguage] = useState('en-US');
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');
  const [showLanguageSelector, setShowLanguageSelector] = useState<'source' | 'target' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<{text: string, translation: string, fromLang: string, toLang: string, timestamp: Date}[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [currentUser, setCurrentUser] = useState<'patient' | 'doctor'>('patient');
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update AI suggestions when messages change
  useEffect(() => {
    if (showAISuggestions && messages.length > 0) {
      const suggestions = getAISuggestions(messages, currentUser === 'patient' ? sourceLanguage : targetLanguage);
      setAiSuggestions(suggestions);
    }
  }, [messages, showAISuggestions, currentUser, sourceLanguage, targetLanguage]);

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Show tutorial on first visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenMedicalTranslatorTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      localStorage.setItem('hasSeenMedicalTranslatorTutorial', 'true');
    }
  }, []);

  const handleStartListening = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = currentUser === 'patient' ? sourceLanguage : targetLanguage;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInputText(text);
      if (view === 'translation') {
        handleTranslate(text);
      }
    };

    recognition.start();
  };

  const handleTranslate = async (text: string = inputText) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);

    try {
      // In a real app, this would be an API call to a translation service
      // For demo purposes, we'll simulate a delay and return a mock translation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTranslations: Record<string, Record<string, string>> = {
        'fr-FR': {
          'en-US': 'This is a mock translation to English',
          'es-ES': 'Esta es una traducción simulada al español'
        },
        'en-US': {
          'fr-FR': 'Ceci est une traduction simulée en français',
          'es-ES': 'Esta es una traducción simulada al español'
        },
        'es-ES': {
          'fr-FR': 'Ceci est une traduction simulée en français',
          'en-US': 'This is a mock translation to English'
        }
      };

      const translatedText = mockTranslations[sourceLanguage]?.[targetLanguage] || text;
      
      setTranslation(translatedText);
      setHistory(prev => [{
        text,
        translation: translatedText,
        fromLang: sourceLanguage,
        toLang: targetLanguage,
        timestamp: new Date()
      }, ...prev]);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Une erreur est survenue lors de la traduction');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const newMessageId = Date.now().toString();
    const fromLang = currentUser === 'patient' ? sourceLanguage : targetLanguage;
    const toLang = currentUser === 'patient' ? targetLanguage : sourceLanguage;
    
    // Add message with "sending" status
    const newMessage: Message = {
      id: newMessageId,
      text: inputText,
      translation: '...',  // Will be updated after translation
      sender: currentUser,
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    try {
      // Simulate translation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock translation based on language
      let translatedText = '';
      if (fromLang === 'fr-FR' && toLang === 'en-US') {
        translatedText = getEnglishTranslation(inputText);
      } else if (fromLang === 'en-US' && toLang === 'fr-FR') {
        translatedText = getFrenchTranslation(inputText);
      } else if (fromLang === 'es-ES' && toLang === 'fr-FR') {
        translatedText = getFrenchTranslation(inputText);
      } else if (fromLang === 'fr-FR' && toLang === 'es-ES') {
        translatedText = getSpanishTranslation(inputText);
      } else if (fromLang === 'en-US' && toLang === 'es-ES') {
        translatedText = getSpanishTranslation(inputText);
      } else if (fromLang === 'es-ES' && toLang === 'en-US') {
        translatedText = getEnglishTranslation(inputText);
      } else {
        translatedText = `[Translated from ${fromLang} to ${toLang}]: ${inputText}`;
      }
      
      // Update message with translation and "sent" status
      setMessages(prev => prev.map(msg => 
        msg.id === newMessageId 
          ? { ...msg, translation: translatedText, status: 'sent' } 
          : msg
      ));
      
      // Add to history
      setHistory(prev => [{
        text: inputText,
        translation: translatedText,
        fromLang,
        toLang,
        timestamp: new Date()
      }, ...prev]);
      
      // Simulate doctor response after a delay
      if (currentUser === 'patient') {
        setTimeout(() => {
          const doctorResponse = generateDoctorResponse(inputText, translatedText);
          const doctorResponseTranslation = currentUser === 'patient' 
            ? doctorResponse 
            : getFrenchTranslation(doctorResponse);
          
          const doctorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: doctorResponse,
            translation: doctorResponseTranslation,
            sender: 'doctor',
            timestamp: new Date(),
            status: 'sent'
          };
          
          setMessages(prev => [...prev, doctorMessage]);
          
          // Update previous message status to "read"
          setMessages(prev => prev.map(msg => 
            msg.id === newMessageId 
              ? { ...msg, status: 'read' } 
              : msg
          ));
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update message with error status
      setMessages(prev => prev.map(msg => 
        msg.id === newMessageId 
          ? { ...msg, translation: 'Error translating message', status: 'sent' } 
          : msg
      ));
    }
  };

  const generateDoctorResponse = (patientMessage: string, translatedMessage: string): string => {
    // Simple rule-based response generation
    const lowerMessage = translatedMessage.toLowerCase();
    
    if (lowerMessage.includes('headache') || lowerMessage.includes('mal de tête')) {
      return "How long have you had this headache? Is it constant or intermittent? Have you taken any medication for it?";
    } else if (lowerMessage.includes('fever') || lowerMessage.includes('fièvre')) {
      return "What is your current temperature? When did the fever start? Are you experiencing any other symptoms?";
    } else if (lowerMessage.includes('pain') || lowerMessage.includes('douleur')) {
      return "Can you describe the pain? Is it sharp, dull, or throbbing? On a scale of 1-10, how would you rate it?";
    } else if (lowerMessage.includes('allergic') || lowerMessage.includes('allergique')) {
      return "What are you allergic to? Have you experienced any allergic reactions recently?";
    } else if (lowerMessage.includes('medication') || lowerMessage.includes('médicament')) {
      return "What medications are you currently taking? Have there been any recent changes to your medication?";
    } else {
      return "Thank you for sharing that information. Could you tell me more about your symptoms? When did they start?";
    }
  };

  // Mock translation functions
  const getEnglishTranslation = (text: string): string => {
    const translations: Record<string, string> = {
      "Bonjour": "Hello",
      "Comment allez-vous?": "How are you?",
      "J'ai mal à la tête": "I have a headache",
      "J'ai de la fièvre": "I have a fever",
      "J'ai besoin d'un médecin": "I need a doctor",
      "Où est l'hôpital le plus proche?": "Where is the nearest hospital?",
      "Je suis allergique à": "I am allergic to",
      "Depuis combien de temps avez-vous mal à la tête ?": "How long have you had this headache?",
      "Avez-vous pris des médicaments ?": "Have you taken any medication?",
      "Avez-vous d'autres symptômes ?": "Do you have any other symptoms?"
    };
    
    // Check for exact matches
    if (translations[text]) {
      return translations[text];
    }
    
    // For demo purposes, return a simulated translation
    return `[EN] ${text}`;
  };

  const getFrenchTranslation = (text: string): string => {
    const translations: Record<string, string> = {
      "Hello": "Bonjour",
      "How are you?": "Comment allez-vous?",
      "I have a headache": "J'ai mal à la tête",
      "I have a fever": "J'ai de la fièvre",
      "I need a doctor": "J'ai besoin d'un médecin",
      "Where is the nearest hospital?": "Où est l'hôpital le plus proche?",
      "I am allergic to": "Je suis allergique à",
      "How long have you had this headache?": "Depuis combien de temps avez-vous mal à la tête ?",
      "Have you taken any medication?": "Avez-vous pris des médicaments ?",
      "Do you have any other symptoms?": "Avez-vous d'autres symptômes ?"
    };
    
    // Check for exact matches
    if (translations[text]) {
      return translations[text];
    }
    
    // For demo purposes, return a simulated translation
    return `[FR] ${text}`;
  };

  const getSpanishTranslation = (text: string): string => {
    const translations: Record<string, string> = {
      "Hello": "Hola",
      "How are you?": "¿Cómo estás?",
      "I have a headache": "Me duele la cabeza",
      "I have a fever": "Tengo fiebre",
      "I need a doctor": "Necesito un médico",
      "Where is the nearest hospital?": "¿Dónde está el hospital más cercano?",
      "I am allergic to": "Soy alérgico a"
    };
    
    // Check for exact matches
    if (translations[text]) {
      return translations[text];
    }
    
    // For demo purposes, return a simulated translation
    return `[ES] ${text}`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (view === 'conversation') {
        handleSendMessage();
      } else {
        handleTranslate();
      }
    }
  };

  const speakText = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('La synthèse vocale n\'est pas supportée par votre navigateur');
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const switchLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText('');
    setTranslation('');
  };

  const startCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setIsCallActive(true);
    setCallDuration(0);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallType(null);
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAISuggestion = (suggestion: string) => {
    setInputText(suggestion);
    inputRef.current?.focus();
  };

  const handleQuickPhrase = (phrase: string) => {
    setInputText(phrase);
    inputRef.current?.focus();
  };

  const handleSwitchUser = () => {
    setCurrentUser(currentUser === 'patient' ? 'doctor' : 'patient');
  };

  const renderTutorial = () => {
    const steps = [
      {
        title: "Bienvenue dans le traducteur médical",
        description: "Cet outil vous permet de communiquer facilement avec des professionnels de santé, même si vous ne parlez pas la même langue.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600"
      },
      {
        title: "Conversation en temps réel",
        description: "Échangez des messages qui sont automatiquement traduits dans la langue de votre interlocuteur.",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600"
      },
      {
        title: "Reconnaissance vocale",
        description: "Parlez dans votre langue et votre message sera traduit instantanément.",
        image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=600"
      },
      {
        title: "Suggestions intelligentes",
        description: "L'IA vous propose des réponses adaptées au contexte de la conversation.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
      }
    ];

    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <motion.div 
          className="bg-white rounded-2xl overflow-hidden max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="relative h-48">
            <img 
              src={steps[tutorialStep - 1].image} 
              alt={steps[tutorialStep - 1].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4 text-white">
                <h3 className="text-xl font-bold">{steps[tutorialStep - 1].title}</h3>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-8">
              {steps[tutorialStep - 1].description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full ${
                      index + 1 === tutorialStep ? 'bg-mybakup-coral' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                {tutorialStep > 1 && (
                  <button
                    onClick={() => setTutorialStep(prev => prev - 1)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600"
                  >
                    Précédent
                  </button>
                )}
                
                {tutorialStep < steps.length ? (
                  <button
                    onClick={() => setTutorialStep(prev => prev + 1)}
                    className="px-4 py-2 bg-mybakup-coral text-white rounded-lg"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="px-4 py-2 bg-mybakup-coral text-white rounded-lg"
                  >
                    Commencer
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-mybakup-blue" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-mybakup-blue">
              Traduction médicale
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-full transition-colors ${
                showHistory ? 'bg-mybakup-coral/10 text-mybakup-coral' : 'hover:bg-gray-100'
              }`}
            >
              <History className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Settings className="w-6 h-6 text-gray-500" />
            </button>
            <button
              onClick={() => setShowLanguageSelector('source')}
              className="p-2 rounded-xl bg-[#FFE8E8] flex items-center gap-1"
            >
              <Languages className="w-5 h-5 text-mybakup-coral" />
              <span className="text-sm font-medium text-mybakup-coral">
                {availableLanguages.find(l => l.code === sourceLanguage)?.flag}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* View Selector */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setView('conversation')}
              className={`py-3 px-4 font-medium transition-colors relative ${
                view === 'conversation' 
                  ? 'text-mybakup-coral' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Conversation
              {view === 'conversation' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-mybakup-coral"
                  layoutId="activeTab"
                />
              )}
            </button>
            <button
              onClick={() => setView('translation')}
              className={`py-3 px-4 font-medium transition-colors relative ${
                view === 'translation' 
                  ? 'text-mybakup-coral' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Traduction
              {view === 'translation' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-mybakup-coral"
                  layoutId="activeTab"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'conversation' ? (
          <div className="h-full flex flex-col">
            {/* Active Call UI */}
            {isCallActive && (
              <div className="bg-gradient-to-r from-mybakup-blue to-purple-600 text-white p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      {callType === 'video' ? (
                        <Video className="w-5 h-5" />
                      ) : (
                        <Phone className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {currentUser === 'patient' 
                          ? participants.find(p => p.role === 'doctor')?.name 
                          : participants.find(p => p.role === 'patient')?.name}
                      </p>
                      <p className="text-sm text-white/80">{formatCallDuration(callDuration)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={endCall}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Conversation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <div key={message.id} className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}>
                  {message.sender !== currentUser && (
                    <img 
                      src={participants.find(p => p.role === message.sender)?.avatar}
                      alt={participants.find(p => p.role === message.sender)?.name}
                      className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                    />
                  )}
                  <div className="max-w-[80%] space-y-1">
                    <div className={`rounded-2xl p-3 ${
                      message.sender === currentUser
                        ? 'bg-mybakup-coral text-white'
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className={`text-xs ${
                          message.sender === currentUser ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => speakText(message.text, message.sender === 'patient' ? sourceLanguage : targetLanguage)}
                            className={`p-1 rounded-full ${
                              message.sender === currentUser 
                                ? 'text-white/70 hover:text-white' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(message.text, index)}
                            className={`p-1 rounded-full ${
                              message.sender === currentUser 
                                ? 'text-white/70 hover:text-white' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {copiedIndex === index ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Translation */}
                    <div className={`rounded-2xl p-3 ${
                      message.sender === currentUser
                        ? 'bg-white border border-gray-200'
                        : 'bg-mybakup-blue/10 text-mybakup-blue'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm">
                        {message.status === 'sending' ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Traduction en cours...
                          </span>
                        ) : (
                          message.translation
                        )}
                      </p>
                      {message.status !== 'sending' && (
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {message.sender === currentUser 
                              ? availableLanguages.find(l => l.code === targetLanguage)?.flag
                              : availableLanguages.find(l => l.code === sourceLanguage)?.flag}
                          </p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => speakText(message.translation, message.sender === 'patient' ? targetLanguage : sourceLanguage)}
                              className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => copyToClipboard(message.translation, index + 100)}
                              className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                            >
                              {copiedIndex === index + 100 ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {message.sender === currentUser && (
                    <img 
                      src={participants.find(p => p.role === message.sender)?.avatar}
                      alt={participants.find(p => p.role === message.sender)?.name}
                      className="w-8 h-8 rounded-full object-cover ml-2 self-end"
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* AI Suggestions */}
            {showAISuggestions && aiSuggestions.length > 0 && (
              <div className="bg-white border-t border-gray-200 p-2">
                <div className="max-w-4xl mx-auto">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleAISuggestion(suggestion)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Phrases */}
            <div className="bg-white border-t border-gray-200 p-2">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {quickPhrases[currentUser === 'patient' ? sourceLanguage : targetLanguage as keyof typeof quickPhrases]?.slice(0, 5).map((phrase) => (
                    <button
                      key={phrase.id}
                      onClick={() => handleQuickPhrase(phrase.text)}
                      className="px-3 py-2 bg-mybakup-coral/10 text-mybakup-coral rounded-full text-sm whitespace-nowrap hover:bg-mybakup-coral/20 transition-colors"
                    >
                      {phrase.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="max-w-4xl mx-auto flex items-end gap-2">
                <div className="flex-shrink-0 flex gap-2">
                  <button
                    onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                    className="p-2 text-gray-500 hover:text-mybakup-coral rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    {showAttachmentOptions && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <button
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                        >
                          <Camera className="w-5 h-5 text-mybakup-coral" />
                          <span>Appareil photo</span>
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                        >
                          <Image className="w-5 h-5 text-mybakup-blue" />
                          <span>Galerie</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Écrivez en ${availableLanguages.find(l => l.code === (currentUser === 'patient' ? sourceLanguage : targetLanguage))?.nativeName}...`}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                
                <div className="flex-shrink-0 flex gap-2">
                  <button
                    onClick={handleStartListening}
                    className={`p-2 rounded-full transition-colors ${
                      isListening
                        ? 'bg-mybakup-coral text-white'
                        : 'text-gray-500 hover:text-mybakup-coral hover:bg-gray-100'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="p-3 bg-mybakup-coral text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Call Buttons */}
            {!isCallActive && (
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-4xl mx-auto flex justify-center gap-4">
                  <button
                    onClick={() => startCall('audio')}
                    className="flex items-center gap-2 px-4 py-2 bg-mybakup-blue text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Appel audio</span>
                  </button>
                  <button
                    onClick={() => startCall('video')}
                    className="flex items-center gap-2 px-4 py-2 bg-mybakup-coral text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    <span>Appel vidéo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Language Selection */}
            <div className="bg-white rounded-xl p-4 flex items-center justify-between">
              <button
                onClick={() => setShowLanguageSelector('source')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">
                  {availableLanguages.find(l => l.code === sourceLanguage)?.flag}
                </span>
                <span className="font-medium text-mybakup-blue">
                  {availableLanguages.find(l => l.code === sourceLanguage)?.name}
                </span>
              </button>

              <button
                onClick={switchLanguages}
                className="p-2 hover:bg-gray-100 rounded-full text-mybakup-coral"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowLanguageSelector('target')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">
                  {availableLanguages.find(l => l.code === targetLanguage)?.flag}
                </span>
                <span className="font-medium text-mybakup-blue">
                  {availableLanguages.find(l => l.code === targetLanguage)?.name}
                </span>
              </button>
            </div>

            {/* Quick Phrases */}
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-gray-500">Phrases rapides</h2>
              <div className="flex flex-wrap gap-2">
                {quickPhrases[sourceLanguage as keyof typeof quickPhrases]?.map((phrase, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputText(phrase.text);
                      handleTranslate(phrase.text);
                    }}
                    className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm hover:border-mybakup-coral transition-colors"
                  >
                    {phrase.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Interface */}
            <div className="grid gap-4">
              {/* Input */}
              <div className="bg-white rounded-xl p-4 space-y-4">
                <div className="flex items-start gap-4">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Entrez votre texte en ${availableLanguages.find(l => l.code === sourceLanguage)?.name}...`}
                    className="flex-1 min-h-[100px] p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral resize-none"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => speakText(inputText, sourceLanguage)}
                      className="p-2 text-gray-400 hover:text-mybakup-coral rounded-full hover:bg-gray-100"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleStartListening}
                      className={`p-2 rounded-full transition-colors ${
                        isListening
                          ? 'bg-mybakup-coral text-white'
                          : 'text-gray-400 hover:text-mybakup-coral hover:bg-gray-100'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleTranslate()}
                    disabled={!inputText.trim() || isProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-mybakup-coral text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Traduire</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Output */}
              {translation && (
                <div className="bg-white rounded-xl p-4 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 p-3 rounded-lg bg-gray-50">
                      <p className="text-mybakup-blue">{translation}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => speakText(translation, targetLanguage)}
                        className="p-2 text-gray-400 hover:text-mybakup-coral rounded-full hover:bg-gray-100"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(translation, -1)}
                        className="p-2 text-gray-400 hover:text-mybakup-coral rounded-full hover:bg-gray-100"
                      >
                        {copiedIndex === -1 ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLanguageSelector && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-sm"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-mybakup-blue">
                    Choisir la langue
                  </h2>
                  <button
                    onClick={() => setShowLanguageSelector(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {availableLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        if (showLanguageSelector === 'source') {
                          setSourceLanguage(language.code);
                        } else {
                          setTargetLanguage(language.code);
                        }
                        setShowLanguageSelector(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-2xl">{language.flag}</span>
                      <div className="flex-1 text-left">
                        <span className="font-medium text-gray-700">{language.name}</span>
                        <p className="text-xs text-gray-500">{language.nativeName}</p>
                      </div>
                      {((showLanguageSelector === 'source' && sourceLanguage === language.code) ||
                        (showLanguageSelector === 'target' && targetLanguage === language.code)) && (
                        <Check className="w-5 h-5 text-mybakup-coral" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-mybakup-blue">
                  Historique des traductions
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {history.length > 0 ? (
                  history.map((entry, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {availableLanguages.find(l => l.code === entry.fromLang)?.flag}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="text-lg">
                            {availableLanguages.find(l => l.code === entry.toLang)?.flag}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <p className="text-mybakup-blue">{entry.text}</p>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => speakText(entry.text, entry.fromLang)}
                              className="p-1 text-gray-400 hover:text-mybakup-coral rounded-full"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => copyToClipboard(entry.text, index + 200)}
                              className="p-1 text-gray-400 hover:text-mybakup-coral rounded-full"
                            >
                              {copiedIndex === index + 200 ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-start justify-between">
                          <p className="text-gray-600">{entry.translation}</p>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => speakText(entry.translation, entry.toLang)}
                              className="p-1 text-gray-400 hover:text-mybakup-coral rounded-full"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => copyToClipboard(entry.translation, index + 300)}
                              className="p-1 text-gray-400 hover:text-mybakup-coral rounded-full"
                            >
                              {copiedIndex === index + 300 ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Aucune traduction dans l'historique
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowHistory(false)}
                  className="w-full py-2 bg-mybakup-coral text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-sm"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-mybakup-blue">
                    Paramètres
                  </h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-mybakup-blue mb-2">Mode utilisateur</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentUser('patient')}
                        className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors ${
                          currentUser === 'patient'
                            ? 'border-mybakup-coral bg-mybakup-coral/5 text-mybakup-coral'
                            : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        Patient
                      </button>
                      <button
                        onClick={() => setCurrentUser('doctor')}
                        className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors ${
                          currentUser === 'doctor'
                            ? 'border-mybakup-blue bg-mybakup-blue/5 text-mybakup-blue'
                            : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        Médecin
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-mybakup-blue mb-2">Suggestions IA</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Afficher les suggestions</span>
                      <button
                        onClick={() => setShowAISuggestions(!showAISuggestions)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          showAISuggestions ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          showAISuggestions ? 'right-1 translate-x-0' : 'left-1 -translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-mybakup-blue mb-2">Aide</h3>
                    <button
                      onClick={() => {
                        setShowSettings(false);
                        setShowTutorial(true);
                        setTutorialStep(1);
                      }}
                      className="flex items-center gap-2 w-full py-2 px-3 rounded-lg border border-gray-200 text-left hover:bg-gray-50 transition-colors"
                    >
                      <HelpCircle className="w-5 h-5 text-mybakup-coral" />
                      <span className="text-gray-700">Voir le tutoriel</span>
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full py-3 bg-mybakup-coral text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors mt-6"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial */}
      <AnimatePresence>
        {showTutorial && renderTutorial()}
      </AnimatePresence>
    </div>
  );
}