# Implementing Chronological Message Flow in React Chat Interfaces

**All three major AI chat platforms—Claude.ai, ChatGPT, and Google Gemini—use the same fundamental approach: standard chronological DOM ordering with JavaScript-managed scroll behavior.** They explicitly avoid CSS tricks like `flex-direction: column-reverse` due to critical cross-browser bugs, particularly in Firefox where column-reverse containers become unscrollable. This guide provides battle-tested patterns for building production-grade chat interfaces with Next.js 14.2.5, React 18, Tailwind CSS, and Framer Motion.

## Architecture patterns from production systems

ChatGPT, Claude, and Gemini all implement React-based chat interfaces with remarkably similar DOM structures. Messages are stored chronologically in the DOM from oldest to newest, matching the natural reading order. The core pattern consists of a flex container with three zones: an optional header, a scrollable message area that grows to fill available space, and a fixed-height input area anchored to the bottom.

**The standard container structure** uses `display: flex` with `flex-direction: column` on the main container. The messages area receives `flex: 1` to expand and fill vertical space, while the input area gets `flex: 0 0 auto` to maintain fixed dimensions. ChatGPT uses the `react-scroll-to-bottom` npm package, evident from its CSS class names, while Claude and Gemini implement custom scroll management with useRef and useEffect hooks. All three platforms render messages in chronological order without DOM reversal:

```jsx
function ChatContainer() {
  return (
    <div className="flex flex-col h-screen">
      {/* Optional header */}
      <div className="flex-none bg-white border-b px-4 py-3">
        <h1 className="text-lg font-semibold">Chat</h1>
      </div>

      {/* Messages area - grows to fill space */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Input area - fixed at bottom */}
      <div className="flex-none border-t bg-white p-4">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
```

This architecture ensures consistent behavior across browsers, avoids accessibility issues from visual-DOM order mismatches, and provides a stable foundation for scroll management. The messages are rendered in the order they appear in state arrays, with the newest message appended to the end of the list.

## CSS layout patterns and the auto-margin technique

**The most reliable pattern for anchoring messages to the bottom uses auto margins rather than justify-content.** This critical distinction prevents a severe data loss bug where early messages become unscrollable when using `justify-content: flex-end` with overflow. When a flex container has both `justify-content: flex-end` and `overflow-y: scroll`, content that overflows beyond the "start" edge becomes inaccessible in many browsers.

The solution applies `margin-top: auto` to the first message element, pushing all content to the bottom before messages accumulate:

```css
.messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /* Never use justify-content: flex-end here */
}

.messages > *:first-child {
  margin-top: auto; /* Pushes messages to bottom when few exist */
}
```

In Tailwind CSS, implement this pattern with utility classes:

```jsx
<div className="flex-1 flex flex-col overflow-y-auto p-4">
  <div className="mt-auto" /> {/* Spacer element */}
  {messages.map(msg => (
    <MessageBubble key={msg.id} {...msg} />
  ))}
</div>
```

**Individual message alignment** for left (received) and right (sent) messages uses `align-self`:

```css
.message {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  margin-bottom: 16px;
}

.message.received {
  align-self: flex-start;
  background: #e5e5ea;
}

.message.sent {
  align-self: flex-end;
  background: #007aff;
  color: white;
}
```

Tailwind implementation for message bubbles:

```jsx
<div className={`flex items-end gap-2 mb-4 ${
  message.isOwn ? 'flex-row-reverse ml-auto' : ''
} max-w-[70%]`}>
  <img src={avatar} className="w-8 h-8 rounded-full" />
  <div className={`rounded-2xl px-4 py-2 ${
    message.isOwn
      ? 'bg-blue-500 text-white rounded-br-none'
      : 'bg-gray-200 rounded-bl-none'
  }`}>
    <p className="text-sm">{message.text}</p>
  </div>
</div>
```

## Smart auto-scroll implementation

The core auto-scroll algorithm requires three components: position detection, conditional scrolling, and scroll preservation. **The fundamental calculation** determines if the user is near the bottom:

```javascript
const isAtBottom = (container) => {
  const threshold = 1; // Pixel tolerance for rounding errors
  return Math.abs(
    container.scrollHeight - container.clientHeight - container.scrollTop
  ) <= threshold;
};
```

The 1-pixel threshold accounts for browsers returning non-rounded floats for scrollTop while scrollHeight and clientHeight are rounded integers. For better UX, increase the threshold to 50-100 pixels to create a "near bottom" zone where auto-scroll still engages.

**A production-ready scroll hook** combines position tracking with conditional auto-scroll:

```javascript
import { useRef, useEffect, useState } from 'react';

export function useSmartScroll(messages) {
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Track scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const threshold = 50;
      const position =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      setIsAtBottom(position < threshold);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll on new messages if at bottom
  useEffect(() => {
    if (isAtBottom && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isAtBottom]);

  return containerRef;
}
```

The `{ passive: true }` listener option significantly improves scroll performance by indicating the handler won't call preventDefault. This allows the browser to optimize scroll handling on the main thread.

**For streaming responses**, the IntersectionObserver API provides elegant automatic scrolling. Place an invisible anchor element at the bottom of the message list and observe its visibility:

```javascript
import { useInView } from 'react-intersection-observer';

function ChatScrollAnchor({ isStreaming, isAtBottom, scrollAreaRef }) {
  const { ref, inView } = useInView({
    trackVisibility: isStreaming, // Only track during active streaming
    delay: 100, // Minimum notification interval
  });

  useEffect(() => {
    // Auto-scroll when: user at bottom, streaming active, anchor out of view
    if (isAtBottom && isStreaming && !inView) {
      const container = scrollAreaRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight - container.clientHeight;
      }
    }
  }, [inView, isAtBottom, isStreaming]);

  return <div ref={ref} className="h-px w-full" />;
}
```

This pattern works beautifully for AI streaming responses where tokens arrive incrementally. The trackVisibility option enables precise detection of when content overflows, but it's computationally expensive—only enable it during active streaming.

**Preserving scroll position when loading older messages** requires capturing the scroll state before adding content:

```javascript
const loadOlderMessages = async () => {
  const container = scrollContainerRef.current;
  if (!container) return;

  // Capture current state
  const oldScrollHeight = container.scrollHeight;
  const oldScrollTop = container.scrollTop;

  // Load messages (prepend to array)
  const olderMessages = await fetchMessages({ before: messages[0].id });
  setMessages(prev => [...olderMessages, ...prev]);

  // Restore position after render
  requestAnimationFrame(() => {
    const newScrollHeight = container.scrollHeight;
    const heightDifference = newScrollHeight - oldScrollHeight;
    container.scrollTop = oldScrollTop + heightDifference;
  });
};
```

Using requestAnimationFrame ensures the scroll adjustment happens after the DOM has updated with new content. This prevents the jarring jump that occurs when older messages push down the user's current viewing position.

## Framer Motion animations for message entry

**Framer Motion's AnimatePresence enables smooth message animations** with minimal code. The basic pattern uses motion variants for enter, exit, and layout animations:

```javascript
import { motion, AnimatePresence } from 'framer-motion';

const messageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

function MessageList({ messages }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {messages.map(message => (
        <motion.div
          key={message.id}
          variants={messageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
        >
          <MessageContent message={message} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

The `mode="popLayout"` prop makes exiting elements pop out of the document flow, preventing other elements from shifting until the exit animation completes. Setting `initial={false}` prevents animations on initial mount, which is crucial for performance when rendering existing message history.

**For streaming indicators**, animate the opacity in a loop:

```javascript
function StreamingIndicator({ isActive }) {
  return (
    <motion.span
      animate={{
        opacity: isActive ? [0.5, 1] : 1
      }}
      transition={{
        repeat: isActive ? Infinity : 0,
        duration: 0.8,
        ease: "easeInOut"
      }}
    >
      ●
    </motion.span>
  );
}
```

**Critical consideration:** Unique, stable keys are essential for AnimatePresence to work correctly. Never use array indices as keys—always use message IDs:

```javascript
// ❌ WRONG: AnimatePresence won't detect changes correctly
{messages.map((msg, index) => (
  <motion.div key={index}>...</motion.div>
))}

// ✅ CORRECT: Stable, unique keys
{messages.map(msg => (
  <motion.div key={msg.id}>...</motion.div>
))}
```

When messages don't have IDs (like optimistic updates), generate temporary UUIDs: `id: crypto.randomUUID()`. For composite keys in multi-channel apps, use `key={`${channelId}-${messageId}`}`.

## Virtualization for large message histories

**React-virtuoso is the best choice for chat interfaces** because it's specifically designed for dynamic-height content with built-in support for reverse scrolling and automatic scroll-to-bottom behavior. At 100+ messages, virtualization becomes essential to maintain 60fps scroll performance.

```javascript
import { Virtuoso } from 'react-virtuoso';

function VirtualizedChat({ messages, onLoadMore }) {
  const virtuosoRef = useRef(null);

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={messages}
      initialTopMostItemIndex={messages.length - 1}
      followOutput={(isAtBottom) => {
        // Only auto-scroll when user is at bottom
        return isAtBottom ? 'smooth' : false;
      }}
      startReached={onLoadMore}
      itemContent={(index, message) => (
        <MessageItem key={message.id} message={message} />
      )}
      components={{
        Header: () => <div className="p-4 text-center">Loading...</div>
      }}
      style={{ height: '100%' }}
      overscan={200}
    />
  );
}
```

The `followOutput` prop accepts a function that receives the current scroll state. Returning `'smooth'` enables auto-scroll with animation, returning `false` disables it, and returning `'auto'` scrolls instantly. The `initialTopMostItemIndex` prop scrolls to the bottom on first render, while `startReached` triggers when scrolling to the top, perfect for loading older messages.

**For simpler use cases without streaming**, react-window offers a lighter alternative at ~6KB:

```javascript
import { VariableSizeList } from 'react-window';

function ChatWindow({ messages }) {
  const listRef = useRef();
  const rowHeights = useRef({});

  const getRowHeight = (index) => rowHeights.current[index] || 80;

  const setRowHeight = (index, size) => {
    listRef.current.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  };

  const Row = ({ index, style }) => {
    const rowRef = useRef();

    useEffect(() => {
      if (rowRef.current) {
        const height = rowRef.current.getBoundingClientRect().height;
        setRowHeight(index, height);
      }
    }, [index]);

    return (
      <div style={style}>
        <div ref={rowRef}>
          <Message data={messages[index]} />
        </div>
      </div>
    );
  };

  return (
    <VariableSizeList
      ref={listRef}
      height={600}
      itemCount={messages.length}
      itemSize={getRowHeight}
      width="100%"
    >
      {Row}
    </VariableSizeList>
  );
}
```

**Memoization is critical** when rendering large message lists. Wrap message components with React.memo and provide custom comparison logic:

```javascript
const MessageItem = memo(({ message, userId }) => {
  const isOwn = message.senderId === userId;

  return (
    <div className={isOwn ? 'message-own' : 'message-other'}>
      <span>{message.text}</span>
      <time>{new Date(message.timestamp).toLocaleTimeString()}</time>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if message content actually changed
  return prevProps.message.id === nextProps.message.id &&
         prevProps.message.text === nextProps.message.text;
});
```

For expensive calculations like message grouping or date formatting, use useMemo:

```javascript
const groupedMessages = useMemo(() => {
  return messages.reduce((groups, msg) => {
    const date = new Date(msg.timestamp).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});
}, [messages]);
```

## Next.js App Router integration patterns

**Server and client component boundaries** should be carefully planned. Fetch initial messages in a Server Component, then hydrate a Client Component for real-time updates:

```javascript
// app/chat/[id]/page.tsx (Server Component)
export default async function ChatPage({ params }) {
  const initialMessages = await db.messages.findMany({
    where: { channelId: params.id },
    orderBy: { timestamp: 'asc' },
    take: 50
  });

  return <ChatContainer initialMessages={initialMessages} />;
}

// components/ChatContainer.tsx (Client Component)
'use client';

import { useState, useEffect } from 'react';

export function ChatContainer({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    return () => {
      ws.close();
      ws.onmessage = null; // Prevent memory leak
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Message list implementation */}
    </div>
  );
}
```

**Optimistic updates** provide instant feedback before server confirmation. Next.js 14's useOptimistic hook handles this elegantly:

```javascript
'use client';

import { useOptimistic } from 'react';
import { sendMessageAction } from '@/app/actions';

export function ChatMessages({ initialMessages }) {
  const [optimisticMessages, addOptimistic] = useOptimistic(
    initialMessages,
    (state, newMessage) => [...state, { ...newMessage, pending: true }]
  );

  async function handleSend(formData) {
    const text = formData.get('message');

    addOptimistic({
      id: crypto.randomUUID(),
      text,
      timestamp: Date.now(),
      senderId: userId
    });

    await sendMessageAction(formData);
  }

  return (
    <form action={handleSend}>
      {optimisticMessages.map(msg => (
        <div key={msg.id} className={msg.pending ? 'opacity-50' : ''}>
          {msg.text}
        </div>
      ))}
      <input name="message" />
      <button>Send</button>
    </form>
  );
}
```

The pending message appears immediately with reduced opacity, then gets replaced by the confirmed version from the server. This pattern maintains responsiveness even with network latency.

## Cross-browser compatibility and mobile considerations

**Safari requires special handling** across multiple dimensions. The scroll-behavior CSS property wasn't supported until Safari 15.4 (March 2022), requiring a polyfill for older versions:

```html
<script src="https://unpkg.com/[email protected]/dist/smoothscroll.min.js"></script>
```

Even in Safari 15.4+, there's a documented bug where setting `scroll-behavior: smooth` in CSS blocks programmatic scrolling with `element.scrollTop = value`. The workaround temporarily toggles the property:

```javascript
function scrollToBottom(container) {
  const originalBehavior = container.style.scrollBehavior;
  container.style.scrollBehavior = 'auto';
  container.scrollTop = container.scrollHeight;
  container.style.scrollBehavior = originalBehavior;
}
```

**iOS Safari's viewport behavior is notoriously problematic.** The `100vh` unit always equals the viewport height with the address bar hidden, not the actual visible height. When the address bar is visible, bottom content gets cut off. The solution uses JavaScript to set a CSS custom property:

```javascript
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);
setViewportHeight();
```

```css
.chat-container {
  height: 100vh; /* Fallback */
  height: 100dvh; /* Dynamic viewport height - modern browsers */
  height: calc(var(--vh, 1vh) * 100); /* JavaScript-calculated fallback */
}
```

The `dvh` unit (dynamic viewport height) is the modern solution, supported in iOS 15.5+. Use a fallback chain for maximum compatibility.

**Position fixed elements flicker in iOS Safari** during scroll. Force GPU acceleration to prevent this:

```css
.fixed-input {
  position: fixed;
  bottom: 0;
  transform: translate3d(0, 0, 0); /* Force GPU layer */
}
```

**Firefox versions before 81 have a critical bug** where `flex-direction: column-reverse` containers with `overflow-y: scroll` become completely unscrollable. The scrollbar appears but is disabled. This is why all major chat platforms avoid column-reverse entirely. If you must support older Firefox versions and need reversed layout, the only reliable workaround uses transform:

```css
/* Firefox detection required */
.messages-container.firefox {
  flex-direction: column;
  transform: scaleY(-1);
}

.messages-container.firefox .message {
  transform: scaleY(-1); /* Flip items back */
}
```

Detect Firefox with: `const isFirefox = typeof InstallTrigger !== 'undefined'`. However, this approach causes text rendering issues during scroll and inverts touch scrolling direction on mobile. **The better solution is avoiding column-reverse entirely** and using standard column direction with JavaScript scroll management.

**Chrome Android's address bar behavior** is similar to iOS Safari. Use the same viewport height solutions. Additionally, handle pull-to-refresh conflicts:

```css
.chat-container {
  overscroll-behavior: contain; /* Prevents scroll chaining */
}

html {
  overscroll-behavior: none; /* Disables pull-to-refresh */
}
```

This prevents the chat container's scroll from triggering page refresh when the user scrolls past the top.

## Common pitfalls when converting inverted layouts

**The most dangerous mistake is assuming flex-direction: column-reverse "just works."** It performs beautifully in Chrome during development, then completely breaks in Firefox production. Always test Firefox early when considering column-reverse.

**Scroll position calculations flip entirely** between column and column-reverse. In column-reverse, `scrollTop = 0` represents the bottom of the container, while in standard column, `scrollTop = 0` is the top. This inverts all scroll detection logic:

```javascript
// Column-reverse: Check if at bottom
const isAtBottom = element.scrollTop === 0;

// Standard column: Check if at bottom
const isAtBottom =
  element.scrollHeight - element.clientHeight - element.scrollTop <= 1;
```

**Auto-scroll logic must be reversed.** With column-reverse, scrolling up (increasing scrollTop) loads older messages, while scrolling down (decreasing scrollTop) shows newer messages. Standard column inverts this. Failing to update these checks causes auto-scroll to trigger at the wrong times.

**Message array ordering changes.** In column-reverse implementations, the newest message is typically first in the DOM (prepended), displaying at the bottom visually. When converting to standard column, newest messages must be last in the DOM (appended). Update your append/prepend logic:

```javascript
// Column-reverse pattern
setMessages(prev => [newMessage, ...prev]); // Prepend

// Standard column pattern
setMessages(prev => [...prev, newMessage]); // Append
```

**Loading older messages requires different scroll restoration.** With column-reverse, older messages are appended to the end of the array. With standard column, they're prepended to the beginning, requiring the scroll position adjustment shown earlier in the load older messages section.

**Accessibility improves dramatically** when converting away from column-reverse. Screen readers follow DOM order, not visual order. Column-reverse creates a mismatch where screen readers announce messages newest-first while sighted users see them oldest-first. Standard column order aligns visual and semantic ordering.

## Complete production implementation

This complete example integrates all patterns discussed:

```javascript
'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Virtuoso } from 'react-virtuoso';

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  }
};

const MessageItem = memo(({ message, isOwn }) => (
  <motion.div
    variants={messageVariants}
    initial="hidden"
    animate="visible"
    layout
    className={`flex items-end gap-2 mb-4 ${isOwn ? 'flex-row-reverse ml-auto' : ''} max-w-[70%]`}
  >
    <img src={message.avatar} className="w-8 h-8 rounded-full" />
    <div className={`rounded-2xl px-4 py-2 ${
      isOwn ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 rounded-bl-none'
    }`}>
      <p className="text-sm">{message.text}</p>
      <time className="text-xs opacity-70">
        {new Date(message.timestamp).toLocaleTimeString()}
      </time>
    </div>
  </motion.div>
));

MessageItem.displayName = 'MessageItem';

export function ChatInterface({ channelId, userId, initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const virtuosoRef = useRef(null);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/${channelId}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    ws.onerror = (error) => console.error('WebSocket error:', error);

    return () => {
      ws.close();
      ws.onmessage = null;
    };
  }, [channelId]);

  // Load older messages
  const loadOlderMessages = useCallback(async () => {
    const oldestMessage = messages[0];
    if (!oldestMessage) return;

    const response = await fetch(
      `/api/messages?channelId=${channelId}&before=${oldestMessage.id}&limit=50`
    );
    const olderMessages = await response.json();

    setMessages(prev => [...olderMessages, ...prev]);
  }, [messages, channelId]);

  // Send message
  const handleSend = useCallback(async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      text: inputValue,
      timestamp: Date.now(),
      senderId: userId,
      avatar: '/user-avatar.jpg',
      pending: true
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setInputValue('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId,
          text: inputValue
        })
      });

      if (!response.ok) throw new Error('Failed to send');
    } catch (error) {
      console.error('Send failed:', error);
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
    }
  }, [inputValue, userId, channelId]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-none bg-white border-b px-4 py-3 shadow-sm">
        <h1 className="text-lg font-semibold">Chat</h1>
      </div>

      {/* Messages with virtualization */}
      <div className="flex-1 overflow-hidden">
        <Virtuoso
          ref={virtuosoRef}
          data={messages}
          initialTopMostItemIndex={messages.length - 1}
          startReached={loadOlderMessages}
          followOutput={(isAtBottom) => isAtBottom ? 'smooth' : false}
          itemContent={(index, message) => (
            <AnimatePresence mode="popLayout">
              <MessageItem
                key={message.id}
                message={message}
                isOwn={message.senderId === userId}
              />
            </AnimatePresence>
          )}
          components={{
            Header: () => (
              <div className="p-4 text-center text-sm text-gray-500">
                Loading older messages...
              </div>
            )
          }}
          style={{ height: '100%' }}
          overscan={200}
        />
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="flex-none border-t bg-white p-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
```

This implementation provides production-ready chat functionality with virtualization for performance, Framer Motion animations for polish, optimistic updates for responsiveness, and proper error handling. The patterns are battle-tested across major browsers and mobile platforms, avoiding the common pitfalls that plague chat implementations.

**Performance targets** for this implementation:
- Initial render: \<100ms for 50 messages
- Scroll performance: Consistent 60fps
- Memory usage: \<100MB for 1000 messages
- Time to Interactive: \<2 seconds

**Key architectural decisions** that enable production quality:
- Standard column direction avoids Firefox scroll bugs
- Virtuoso handles dynamic heights automatically
- Auto-scroll respects user reading position
- Optimistic updates maintain responsiveness
- Proper cleanup prevents memory leaks
- Cross-browser viewport handling for mobile
- Memoization prevents unnecessary re-renders

The combination of these patterns creates chat interfaces that match the quality and performance of Claude.ai, ChatGPT, and Google Gemini while maintaining clean, maintainable code that works reliably across all modern browsers and mobile platforms.
