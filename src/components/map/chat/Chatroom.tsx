import { useState, useCallback } from 'react';
import { MessageSquareIcon } from 'lucide-react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import * as message from '@/components/ai-elements/message';
import {
  PromptInputProvider,
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import { nanoid } from 'nanoid';
import type { UIMessage } from 'ai';

type SidebarMessage = {
  key: string;
  content: string;
  role: UIMessage['role'];
};

const Chatroom = () => {
  const [visibleMessages, setVisibleMessages] = useState<SidebarMessage[]>([]);
  const [status, setStatus] = useState<
    'submitted' | 'streaming' | 'ready' | 'error'
  >('ready');

  const handleSubmit = useCallback(async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) return;

    setStatus('submitted');

    const userMessage: SidebarMessage = {
      content: message.text,
      key: nanoid(),
      role: 'user',
    };

    // Show user message immediately
    setVisibleMessages((prev) => [...prev, userMessage]);

    try {
      setStatus('streaming');

      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.text,
          building_name: 'Engineering Hall I', // you can make this dynamic
          building_info: 'Concrete structure, built in 1990', // dynamic too
        }),
      });

      const data = await response.json();

      const botMessage: SidebarMessage = {
        content: data.response,
        key: nanoid(),
        role: 'assistant',
      };

      setVisibleMessages((prev) => [...prev, botMessage]);
      setStatus('ready');
    } catch (error) {
      console.error('Error:', error);

      setVisibleMessages((prev) => [
        ...prev,
        {
          content: 'Error contacting server.',
          key: nanoid(),
          role: 'system',
        },
      ]);

      setStatus('ready');
    }
  }, []);

  return (
    <>
      <Conversation className="relative size-full">
        <ConversationContent>
          {visibleMessages.length === 0 ? (
            <ConversationEmptyState
              description="Messages will appear here as the conversation progresses."
              icon={<MessageSquareIcon className="size-6" />}
              title="Start a conversation"
            />
          ) : (
            visibleMessages.map(({ key, content, role }) => (
              <message.Message from={role} key={key}>
                <message.MessageContent>{content}</message.MessageContent>
              </message.Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <PromptInputProvider>
        <PromptInput
          className="px-1.5 py-1.5"
          globalDrop
          multiple
          onSubmit={handleSubmit}
        >
          <PromptInputBody>
            <PromptInputTextarea />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </>
  );
};

export default Chatroom;
