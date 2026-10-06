# Backup da Kaizen Barbearia

Capturado em 2026-10-06T19:01:55.588Z (UTC), versão 13.

## O que está incluído
- Código completo, fotos, painel, estilos e migrações em codigo/.
- Banco de dados atual em banco/kaizen.sqlite.
- SQL para reconstruir as tabelas e os dados em banco/restaurar-banco.sql.
- Dados em JSON e configuração de hospedagem recuperável.
- Procedimento para recriar as credenciais que a hospedagem não exporta.

Contagens: {"site_settings": 1, "weekly_hours": 0, "barber_credentials": 0, "bookings": 0, "slots": 0, "service_settings": 4}.
Tabelas vazias também estão preservadas. A ausência de horários personalizados faz o site usar o padrão do código.

## Limitação das credenciais
Os segredos BARBER_PASSWORD_HASH, BARBER_PASSWORD_SALT e BARBER_SESSION_KEY não são retornados pela plataforma. ADMIN_USER_IDS também não foi exportado; o painel atual usa o login próprio do barbeiro, não essa variável legada. Não há como recuperar a senha inicial a partir deste backup. A tabela barber_credentials está vazia nesta captura, então na restauração é preciso configurar uma nova senha inicial.

Execute `python3 configurar-senha-restauracao.py` dentro de banco/ e digite a nova senha no terminal. O script gera variáveis de configuração, incluindo um novo segredo de sessões. Não publica nada nem modifica o banco ou o site original. Configure o arquivo gerado no runtime da hospedagem de destino e não o disponibilize em pasta pública.

## Restauração
1. Leia codigo/LEIA-ME.md sobre Node.js, Vinext, Cloudflare Workers e D1.
2. Configure o código em uma hospedagem compatível. Outra tecnologia requer adaptar a aplicação.
3. Para um banco SQLite novo, use banco/kaizen.sqlite ou importe banco/restaurar-banco.sql. O SQL já contém o esquema completo: não execute as migrações iniciais novamente sobre esse banco. Ajuste o registro de migrações do destino para reconhecer o esquema existente.
4. No Cloudflare D1, o administrador deve importar o SQL para um banco novo e associá-lo ao binding DB. O arquivo SQLite serve como cópia portátil; a configuração exata depende do provedor.
5. Configure BARBER_USERNAME e os três segredos de autenticação gerados pelo procedimento acima.
6. Confira Pix, WhatsApp, login, serviços, horários, agendamentos e o modo público/privado antes de abrir o novo endereço.

Os oito registros fictícios foram excluídos DESTA CÓPIA. No site atual, a exclusão ainda depende de entrar no painel e usar “Excluir os testes identificados”. O botão foi publicado e só remove os registros identificados, preservando novos agendamentos.

O SQL e o SQLite foram verificados e contêm os mesmos registros. A exportação foi feita por leituras de tabelas e uma segunda leitura retornou os mesmos dados; não é uma transação única de snapshot do servidor. Não houve alteração do site original.

## Cuidados com a cópia
Este arquivo contém nomes, telefones de clientes e informações de pedidos. Guarde em local privado. Ele preserva o estado da captura; agendamentos e alterações posteriores exigem outro backup. A cópia não transfere domínio, conta de hospedagem ou histórico de implantações.
