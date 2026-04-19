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

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;

const Chatroom = () => {
  const [visibleMessages, setVisibleMessages] = useState<SidebarMessage[]>([]);
  const [status, setStatus] = useState<
    'submitted' | 'streaming' | 'ready' | 'error'
  >('ready');

  const handleSubmit = useCallback((message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus('submitted');

    console.log('Submitting message:', message);

    setTimeout(() => {
      setStatus('streaming');
      const newMessage: SidebarMessage = {
        content: message.text,
        key: nanoid(),
        role: 'user',
      };

      setVisibleMessages((prev) => [...prev, newMessage]);
    }, SUBMITTING_TIMEOUT);

    setTimeout(() => {
      setStatus('ready');
      const newBotMessage: SidebarMessage = {
        content: 'I am a bot.',
        key: nanoid(),
        role: 'assistant',
      };
      setVisibleMessages((prev) => [...prev, newBotMessage]);
    }, STREAMING_TIMEOUT);
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
