export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
    role: Role;
      content: string;
        timestamp: number;
          error?: boolean;
          }

          export interface Conversation {
            id: string;
              title: string;
                messages: Message[];
                  createdAt: number;
                    updatedAt: number;
                      model: ModelId;
                      }

                      export type ModelId = 'claude-sonnet-4-20250514' | 'claude-haiku-4-5-20251001';

                      export interface Model {
                        id: ModelId;
                          name: string;
                            description: string;
                            }

                            export const MODELS: Model[] = [
                              { id: 'claude-sonnet-4-20250514', name: 'Nova', description: 'Most capable' },
                                { id: 'claude-haiku-4-5-20251001', name: 'Nova Mini', description: 'Faster & lighter' },
                                ];
                                
