import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ToolResponseProps {
  isEnabled: boolean;
  summary?: React.ReactNode;
  details?: React.ReactNode;
}

export function ToolResponse({ isEnabled, summary, details }: ToolResponseProps) {
  return (
    <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)] h-full">
      <Tabs defaultValue="summary" className="h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary" disabled={!isEnabled}>
            Resumo
          </TabsTrigger>
          <TabsTrigger value="details" disabled={!isEnabled}>
            Detalhes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-6">
          {isEnabled ? (
            summary
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-[#9ca3af]">
              <p>Preencha o formulário para ver o resumo da análise</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="details" className="mt-6">
          {isEnabled ? (
            details
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-[#9ca3af]">
              <p>Preencha o formulário para ver os detalhes da análise</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 