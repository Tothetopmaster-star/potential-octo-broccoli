import { useEffect } from 'react';
import { useStore } from './store';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

export default function App() {
  const { sidebarOpen, toggleSidebar, createConversation, activeConversationId, setActiveConversation, conversations } = useStore();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                      e.preventDefault();
                              createConversation();
                                    }
                                        };
                                            window.addEventListener('keydown', handler);
                                                return () => window.removeEventListener('keydown', handler);
                                                  }, [createConversation]);

                                                    useEffect(() => {
                                                        if (!activeConversationId && conversations.length > 0) {
                                                              setActiveConversation(conversations[0].id);
                                                                  }
                                                                    }, []);

                                                                      return (
                                                                          <div className="flex h-screen w-full overflow-hidden bg-[#0d0d0d]">
                                                                                {/* Mobile overlay */}
                                                                                      {sidebarOpen && (
                                                                                              <div
                                                                                                        className="fixed inset-0 z-20 bg-black/50 md:hidden"
                                                                                                                  onClick={toggleSidebar}
                                                                                                                          />
                                                                                                                                )}
                                                                                                                                
                                                                                                                                      {/* Sidebar */}
                                                                                                                                            <div className={`
                                                                                                                                                    fixed md:relative z-30 md:z-auto h-full
                                                                                                                                                            transition-all duration-300 ease-in-out
                                                                                                                                                                    ${sidebarOpen ? 'w-[260px]' : 'w-0 md:w-0'}
                                                                                                                                                                            overflow-hidden flex-shrink-0
                                                                                                                                                                                  `}>
                                                                                                                                                                                          <Sidebar />
                                                                                                                                                                                                </div>
                                                                                                                                                                                                
                                                                                                                                                                                                      {/* Main Content */}
                                                                                                                                                                                                            <div className="flex-1 flex flex-col min-w-0">
                                                                                                                                                                                                                    <ChatArea />
                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                
