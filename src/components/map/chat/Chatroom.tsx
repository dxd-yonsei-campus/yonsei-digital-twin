import { useState, useCallback } from 'react';
import { Building, MessageSquareIcon } from 'lucide-react';
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
import { useStore } from '@nanostores/react';
import { selectedId } from '@/store';
import { getBuildingWithId } from '@/lib/mapApi';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { Shimmer } from '@/components/ai-elements/shimmer';

type SidebarMessage = {
  key: string;
  content: string;
  role: UIMessage['role'];
};

type ChatroomProps = {
  lang: keyof typeof ui;
};

const Chatroom = ({ lang }: ChatroomProps) => {
  const t = useTranslations(lang);
  const [visibleMessages, setVisibleMessages] = useState<SidebarMessage[]>([]);
  const [status, setStatus] = useState<
    'submitted' | 'streaming' | 'ready' | 'error'
  >('ready');

  const currentId = useStore(selectedId);
  const buildingData = getBuildingWithId(currentId);

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
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

      // Execute fetch asynchronously to allow the input to clear immediately
      void (async () => {
        try {
          setStatus('streaming');

          const apiURL =
            import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';
          const response = await fetch(`${apiURL}/api/chat/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: message.text,
              building_name: buildingData?.name_en || null,
              building_info: buildingData
                ? `${buildingData.construction_type_en || 'Standard structure'}${
                    buildingData.approval_date
                      ? `, built in ${new Date(
                          buildingData.approval_date,
                        ).getFullYear()}`
                      : ''
                  }`
                : null,
              history: visibleMessages
                .filter((m) => m.role === 'user' || m.role === 'assistant')
                .slice(-10)
                .map((m) => ({ role: m.role, content: m.content })),
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
      })();
    },
    [buildingData],
  );

  return (
    <>
      <Conversation className="relative size-full">
        <ConversationContent>
          {visibleMessages.length === 0 ? (
            <ConversationEmptyState
              description={t('chatroom.empty_conv_description')}
              icon={<MessageSquareIcon className="size-6" />}
              title={t('chatroom.empty_conv_title')}
            />
          ) : (
            visibleMessages.map(({ key, content, role }) => (
              <message.Message from={role} key={key}>
                <message.MessageContent>{content}</message.MessageContent>
              </message.Message>
            ))
          )}
          {(status === 'submitted' || status === 'streaming') && (
            <message.Message from="assistant">
              <message.MessageContent>
                <Shimmer>{t('chatroom.thinking')}</Shimmer>
              </message.MessageContent>
            </message.Message>
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
            <PromptInputTextarea
              placeholder={t('chatroom.input_placeholder')}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              {buildingData && (
                <div className="inline-flex w-fit max-w-52 items-center gap-1.5 rounded-xs border border-white/30 px-1.5 py-1 text-xs overflow-ellipsis whitespace-nowrap opacity-70">
                  <Building className="size-3.5 shrink-0" />
                  <span className="truncate">
                    {lang == 'ko' ? buildingData.name : buildingData.name_en}
                  </span>
                </div>
              )}
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </>
  );
};

export default Chatroom;
