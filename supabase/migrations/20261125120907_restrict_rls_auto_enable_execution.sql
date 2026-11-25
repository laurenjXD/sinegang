-- This project has a pre-existing event-trigger helper with SECURITY DEFINER.
-- The trigger can continue to invoke it; browser API roles do not need RPC access.
do $migration$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end
$migration$;
