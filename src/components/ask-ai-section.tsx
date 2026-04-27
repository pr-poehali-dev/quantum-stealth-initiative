import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

interface Message {
  role: "user" | "ai"
  text: string
}

const PLACEHOLDER_ANSWERS = [
  "DAV AI анализирует ваш запрос и предоставляет точные, персонализированные ответы в режиме реального времени.",
  "Наша система обучена на миллиардах данных, чтобы давать вам максимально релевантные результаты.",
  "DAV AI постоянно обучается и совершенствуется, чтобы лучше понимать ваши потребности.",
  "Это отличный вопрос! DAV AI готов помочь вам достичь ваших целей с помощью передовых алгоритмов.",
  "DAV AI интегрируется с вашими инструментами и процессами, делая работу проще и эффективнее.",
]

export function AskAISection() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Привет! Я DAV AI. Задайте мне любой вопрос — я готов помочь." },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    const text = input.trim()
    if (!text || loading) return
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text }])
    setLoading(true)
    setTimeout(() => {
      const answer = PLACEHOLDER_ANSWERS[Math.floor(Math.random() * PLACEHOLDER_ANSWERS.length)]
      setMessages((prev) => [...prev, { role: "ai", text: answer }])
      setLoading(false)
    }, 1200)
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <section id="ask-ai" className="py-24 px-6 bg-black">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Задайте вопрос <span className="text-red-500">DAV AI</span>
          </h2>
          <p className="font-geist text-gray-400 text-lg">
            Спросите всё что вас интересует — AI ответит мгновенно
          </p>
        </div>

        <div className="bg-white/5 border border-red-500/20 rounded-2xl overflow-hidden">
          {/* Chat messages */}
          <div className="h-80 overflow-y-auto p-6 space-y-4 scrollbar-thin">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    msg.role === "ai"
                      ? "bg-red-500 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {msg.role === "ai" ? "AI" : "Вы"}
                </div>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-xl font-geist text-sm leading-relaxed ${
                    msg.role === "ai"
                      ? "bg-white/5 text-gray-200 rounded-tl-none"
                      : "bg-red-500/20 text-white rounded-tr-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white">
                  AI
                </div>
                <div className="bg-white/5 px-4 py-3 rounded-xl rounded-tl-none flex gap-1 items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-red-500/20 p-4 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Напишите ваш вопрос..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 font-geist text-sm outline-none focus:border-red-500/50 transition-colors"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="bg-red-500 hover:bg-red-600 text-white border-0 px-4 rounded-xl disabled:opacity-40"
            >
              <Icon name="Send" size={18} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AskAISection
