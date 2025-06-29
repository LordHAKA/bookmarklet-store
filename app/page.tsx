"use client"

import { useState } from "react"
import { Copy, Check, Zap, Sparkles, Gamepad2, Palette, Music, Eye, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const bookmarklets = [
  {
    id: 1,
    name: "Rainbow Text",
    description: "Transform all text on the page into rainbow colors",
    category: "Visual",
    icon: Palette,
    code: `javascript:(function(){var colors=['#ff0000','#ff8000','#ffff00','#80ff00','#00ff00','#00ff80','#00ffff','#0080ff','#0000ff','#8000ff','#ff00ff','#ff0080'];var elements=document.querySelectorAll('*');elements.forEach(function(el){if(el.children.length===0&&el.textContent.trim()){var text=el.textContent;var coloredText='';for(var i=0;i<text.length;i++){coloredText+='<span style="color:'+colors[i%colors.length]+'">'+text[i]+'</span>';}el.innerHTML=coloredText;}});})();`,
  },
  {
    id: 2,
    name: "Gravity Drop",
    description: "Make all elements on the page fall down with gravity",
    category: "Physics",
    icon: Zap,
    code: `javascript:(function(){var elements=document.querySelectorAll('*');elements.forEach(function(el){el.style.position='relative';el.style.transition='transform 2s ease-in';el.style.transform='translateY('+Math.random()*500+'px) rotate('+Math.random()*360+'deg)';});})();`,
  },
  {
    id: 3,
    name: "Disco Mode",
    description: "Turn any website into a disco with flashing colors",
    category: "Party",
    icon: Sparkles,
    code: `javascript:(function(){var colors=['#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff'];var i=0;setInterval(function(){document.body.style.backgroundColor=colors[i%colors.length];i++;},200);})();`,
  },
  {
    id: 4,
    name: "Snake Game",
    description: "Play Snake game overlay on any website",
    category: "Games",
    icon: Gamepad2,
    code: `javascript:(function(){if(document.getElementById('snakeGame'))return;var canvas=document.createElement('canvas');canvas.id='snakeGame';canvas.width=400;canvas.height=400;canvas.style.position='fixed';canvas.style.top='50%';canvas.style.left='50%';canvas.style.transform='translate(-50%,-50%)';canvas.style.zIndex='9999';canvas.style.border='2px solid #fff';canvas.style.backgroundColor='#000';document.body.appendChild(canvas);var ctx=canvas.getContext('2d');var snake=[{x:200,y:200}];var food={x:100,y:100};var dx=20,dy=0;function draw(){ctx.clearRect(0,0,400,400);ctx.fillStyle='#0f0';snake.forEach(segment=>ctx.fillRect(segment.x,segment.y,20,20));ctx.fillStyle='#f00';ctx.fillRect(food.x,food.y,20,20);}function update(){var head={x:snake[0].x+dx,y:snake[0].y+dy};snake.unshift(head);if(head.x===food.x&&head.y===food.y){food={x:Math.floor(Math.random()*20)*20,y:Math.floor(Math.random()*20)*20};}else{snake.pop();}}document.addEventListener('keydown',e=>{if(e.key==='ArrowUp'&&dy===0){dx=0;dy=-20;}else if(e.key==='ArrowDown'&&dy===0){dx=0;dy=20;}else if(e.key==='ArrowLeft'&&dx===0){dx=-20;dy=0;}else if(e.key==='ArrowRight'&&dx===0){dx=20;dy=0;}else if(e.key==='Escape'){canvas.remove();}});setInterval(()=>{update();draw();},150);})();`,
  },
  {
    id: 5,
    name: "Matrix Rain",
    description: "Add Matrix-style falling code rain effect",
    category: "Visual",
    icon: Eye,
    code: `javascript:(function(){var canvas=document.createElement('canvas');canvas.style.position='fixed';canvas.style.top='0';canvas.style.left='0';canvas.style.width='100%';canvas.style.height='100%';canvas.style.zIndex='9998';canvas.style.pointerEvents='none';canvas.width=window.innerWidth;canvas.height=window.innerHeight;document.body.appendChild(canvas);var ctx=canvas.getContext('2d');var chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';var drops=[];for(var i=0;i<canvas.width/10;i++){drops[i]=1;}function draw(){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#0f0';ctx.font='10px monospace';for(var i=0;i<drops.length;i++){var text=chars[Math.floor(Math.random()*chars.length)];ctx.fillText(text,i*10,drops[i]*10);if(drops[i]*10>canvas.height&&Math.random()>0.975){drops[i]=0;}drops[i]++;}}setInterval(draw,33);})();`,
  },
  {
    id: 6,
    name: "Sound Effects",
    description: "Add a click sound on every mouse-down event",
    category: "Audio",
    icon: Music,
    code: `javascript:(function(){var src='https://cdn.jsdelivr.net/gh/vitejs/vite@main/packages/playground/audio/pop.wav';document.addEventListener('mousedown',function(){var a=new Audio(src);a.volume=0.2;a.play();});alert('Click anywhere to hear a pop!');})();`,
  },
  {
    id: 7,
    name: "BlooHakr",
    description: "Advanced web manipulation and debugging toolkit",
    category: "Hacks",
    icon: Terminal,
    code: `coming soon`,
  },
  {
    id: 8,
    name: "BlooHakr Mobile",
    description: "Advanced web manipulation and debugging toolkit",
    category: "Hacks",
    icon: Terminal,
    code: `coming soon`,
  },
  {
    id: 9,
    name: "BlooHakr K-GUI",
    description: "Advanced web manipulation and debugging toolkit",
    category: "Hacks",
    icon: Terminal,
    code: `coming soon`,
  },
  {
    id: 10,
    name: "BlooHakr 2.0",
    description: "Advanced web manipulation and debugging toolkit",
    category: "Hacks",
    icon: Terminal,
    code: `coming soon`,
  },
]

const categories = ["All", "Visual", "Physics", "Party", "Games", "Audio", "Hacks"]

export default function BookmarkletStore() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const { toast } = useToast()

  const filteredBookmarklets =
    selectedCategory === "All" ? bookmarklets : bookmarklets.filter((b) => b.category === selectedCategory)

  const copyToClipboard = async (code: string, id: number) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedId(id)
      toast({
        title: "Copied!",
        description: "Bookmarklet code copied to clipboard",
      })
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the code manually",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            BOOKMARKLET STORE
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced JavaScript bookmarklets for web manipulation and enhancement. Drag to bookmarks bar or copy the
            code.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`
                ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent"
                    : "bg-slate-800/50 text-gray-300 border-gray-600 hover:bg-slate-700/50"
                }
                backdrop-blur-sm transition-all duration-300
              `}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Bookmarklets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarklets.map((bookmarklet) => {
            const IconComponent = bookmarklet.icon
            return (
              <Card
                key={bookmarklet.id}
                className="bg-slate-800/50 border-gray-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-300">
                        <IconComponent className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{bookmarklet.name}</CardTitle>
                        <Badge variant="secondary" className="bg-slate-700 text-gray-300 text-xs">
                          {bookmarklet.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 mb-4">{bookmarklet.description}</CardDescription>

                  <div className="space-y-3">
                    {/* Drag-to-bookmark link */}
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-gray-600">
                      <p className="text-xs text-gray-400 mb-2">Drag this link to your bookmarks bar:</p>
                      <a
                        href={bookmarklet.code}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-sm break-all transition-colors duration-200"
                        draggable="true"
                      >
                        {bookmarklet.name}
                      </a>
                    </div>

                    {/* Copy button */}
                    <Button
                      onClick={() => copyToClipboard(bookmarklet.code, bookmarklet.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300"
                    >
                      {copiedId === bookmarklet.id ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p className="text-sm">
            ⚡ Powered by JavaScript • Use responsibly • Some bookmarklets may not work on all sites
          </p>
        </div>
      </div>
    </div>
  )
}
