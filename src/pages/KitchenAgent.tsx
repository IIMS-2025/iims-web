import React, { useState, useRef, useEffect } from 'react';
import '../styles/kitchenAgent.css';
import SalesCogsChart from '../components/SalesCogsChart';
import CriticalStockTable from '../components/CriticalStockTable';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  hasChart?: boolean;
  chartData?: {
    day: string;
    sales: number;
    cogs: number;
  }[];
  hasTable?: boolean;
  tableData?: {
    name: string;
    stockQty: number;
    unit: string;
    status: 'critical' | 'low';
  }[];
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface QuickResponse {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const KitchenAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your RockStar Manager. I can help you with inventory, menu, and cost analysis. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
  ];

  const quickResponses: QuickResponse[] = [
    {
      id: 'yesterday-insights',
      title: 'Yesterday\'s Performance',
      description: 'What was yesterday like?',
      icon: '📈',
      color: 'green'
    },
    {
      id: 'tomorrow-forecast',
      title: 'Tomorrow\'s Forecast',
      description: 'How will be my tomorrow?',
      icon: '🔮',
      color: 'purple'
    },
    {
      id: 'inventory-status',
      title: 'Inventory Check',
      description: 'Show critical stock levels',
      icon: '📦',
      color: 'orange'
    },
    {
      id: 'cost-analysis',
      title: 'Cost Analysis',
      description: 'Analyze today\'s costs',
      icon: '💰',
      color: 'blue'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(inputText);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        hasChart: response.hasChart,
        chartData: response.chartData,
        hasTable: response.hasTable,
        tableData: response.tableData
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (input: string): { content: string; hasChart?: boolean; chartData?: any[]; hasTable?: boolean; tableData?: any[] } => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('yesterday') || lowerInput.includes('performance')) {
      return {
        content: "Yesterday's performance:\n\n💰 Revenue: ₹4,457\n📈 vs Day Before: +12%\n🥗 Top seller: Classic Chicken Burger\n⏰ Peak time: 12:30-1:30 PM\n\nHere's your sales trend vs COGS:",
        hasChart: true,
        chartData: [
          { day: 'Yesterday', sales: 4457, cogs: 2150 }
        ]
      };
    }
    if (lowerInput.includes('tomorrow') || lowerInput.includes('forecast')) {
      return {
        content: "Tomorrow's forecast:\n\n💰 Projected Revenue: ₹5,950\n📈 Expected Growth: +15%\n🥗 Burger will be the top seller since it's weekend\n⏰ Expected Peak time: 6:00-8:00 PM"
      };
    }
    if (lowerInput.includes('stock') || lowerInput.includes('status') || lowerInput.includes('inventory') || lowerInput.includes('critical')) {
      return {
        content: "Inventory status:\n\n📦 Total items: 247\n⚠️ Low stock items: 12\n🔴 Critical items: 3\n📅 Items expiring soon: 8\n\nHere are the critical stock items that need immediate attention:",
        hasTable: true,
        tableData: [
          { name: 'Fresh Lettuce', stockQty: 2, unit: 'kg', status: 'critical' },
          { name: 'Chicken Breast', stockQty: 1, unit: 'kg', status: 'critical' },
          { name: 'Tomatoes', stockQty: 3, unit: 'kg', status: 'critical' },
          { name: 'Cheese Slices', stockQty: 15, unit: 'pcs', status: 'low' },
          { name: 'Burger Buns', stockQty: 8, unit: 'pcs', status: 'low' }
        ]
      };
    }
    if (lowerInput.includes('cost') || lowerInput.includes('analysis')) {
      return {
        content: "Cost analysis:\n\n💸 Total COGS: ₹650\n📊 Cost Margin: 27%\n📈 vs Yesterday: -8%\n🥬 Highest cost item: Premium Meat"
      };
    }
    return {
      content: "I understand you're asking about: \"" + input + "\"\n\nI can help you with:\n• Inventory management\n• Menu analysis\n• Cost optimization\n• Revenue insights\n• Waste reduction\n\nCould you be more specific about what you'd like to know?"
    };
  };

  const handleQuickAction = (action: QuickAction) => {
    const actionMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: action.title,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, actionMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = getAIResponse(action.title);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        hasChart: aiResponse.hasChart,
        chartData: aiResponse.chartData,
        hasTable: aiResponse.hasTable,
        tableData: aiResponse.tableData
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickResponse = (response: QuickResponse) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: response.description,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponseData = getAIResponse(response.description);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponseData.content,
        timestamp: new Date(),
        hasChart: aiResponseData.hasChart,
        chartData: aiResponseData.chartData,
        hasTable: aiResponseData.hasTable,
        tableData: aiResponseData.tableData
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="kitchen-agent m-4">
      <div className="chat-container">
        <div className="messages-area">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                {message.type === 'assistant' && (
                  <div className="message-avatar">
                    🤖
                  </div>
                )}
                <div className={`message-bubble ${message.hasChart ? 'with-chart' : ''} ${message.hasTable ? 'with-table' : ''}`}>
                  <div className="message-text">
                    {message.content.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < message.content.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  {message.hasChart && message.chartData && (
                    <SalesCogsChart data={message.chartData} />
                  )}
                  {message.hasTable && message.tableData && (
                    <CriticalStockTable items={message.tableData} />
                  )}
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message assistant">
              <div className="message-content">
                <div className="message-avatar">
                  🤖
                </div>
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="quick-actions">
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={action.id}
                  className={`user-guide-kitchen-agent-quick-actions${index + 1} quick-action-card quick-action-${action.color}`}
                  onClick={() => handleQuickAction(action)}
                >
                  <div className="action-icon">
                    {action.icon}
                  </div>
                  <div className="action-content">
                    <div className="action-title">{action.title}</div>
                    <div className="action-description">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Responses */}
        <div className="quick-responses">
          <div className="quick-responses-grid">
            {quickResponses.map((response, index) => (
              <button
                key={response.id}
                className={`quick-response-card quick-response-${response.color}`}
                onClick={() => handleQuickResponse(response)}
              >
                <div className="response-icon">
                  {response.icon}
                </div>
                <div className="response-content">
                  <div className="response-title">{response.title}</div>
                  <div className="response-description">{response.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about inventory, menu, costs"
              className="message-input"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="send-button"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M18 2L9 11L6 8L18 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 2L13 18L9 11L18 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenAgent;
