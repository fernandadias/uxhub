-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários podem ver suas próprias análises" ON public.heuristic_analysis;
DROP POLICY IF EXISTS "Usuários podem criar suas próprias análises" ON public.heuristic_analysis;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias análises" ON public.heuristic_analysis;
DROP POLICY IF EXISTS "Usuários podem ver screenshots de suas análises" ON public.screenshots;
DROP POLICY IF EXISTS "Usuários podem criar screenshots para suas análises" ON public.screenshots;

-- Recriar políticas com permissões mais amplas
CREATE POLICY "Usuários podem ver suas próprias análises"
ON public.heuristic_analysis
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias análises"
ON public.heuristic_analysis
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias análises"
ON public.heuristic_analysis
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver screenshots de suas análises"
ON public.screenshots
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.heuristic_analysis
    WHERE heuristic_analysis.id = screenshots.analysis_id
    AND heuristic_analysis.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem criar screenshots para suas análises"
ON public.screenshots
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.heuristic_analysis
    WHERE heuristic_analysis.id = screenshots.analysis_id
    AND heuristic_analysis.user_id = auth.uid()
  )
);

-- Verificar se as políticas foram criadas
SELECT * FROM pg_policies WHERE tablename IN ('heuristic_analysis', 'screenshots'); 