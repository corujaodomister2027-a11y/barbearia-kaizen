# Kaizen Barbearia — código-fonte completo

Este pacote contém o código da versão publicada em 6 de outubro de 2026, incluindo fotos, estilos, painel e migrações do banco de dados.

## Funcionalidades
- Agendamento, consulta de disponibilidade e reserva de horários.
- Pix antecipado com conferência manual pelo barbeiro.
- Login do barbeiro, troca de senha e encerramento de sessões antigas.
- Cadastro de serviços, nomes, preços e duração.
- Dias e horários de atendimento editáveis.
- Modo público/privado no painel, com bloqueio do conteúdo e das APIs para visitantes quando privado.
- Galeria de fotos e links para Instagram e WhatsApp.

## Tecnologia e compatibilidade
O projeto utiliza TypeScript, React, Vinext/Vite e Cloudflare Workers, com banco D1 (SQLite). Não é um site estático: enviar os arquivos para uma hospedagem comum de HTML/PHP não faz o sistema funcionar.

Para outra hospedagem, um desenvolvedor precisa configurar o ambiente e o banco. Uma plataforma diferente de Cloudflare Workers/D1 exige adaptar os acessos em lib/db.ts e os imports de cloudflare:workers, além da configuração de build e publicação. Este pacote é o código-fonte, não uma migração concluída para outro provedor.

## Preparação local
1. Instale Node.js na versão 22.13 ou posterior e o gerenciador pnpm na versão indicada em package.json.
2. Na pasta do projeto, instale as dependências com `pnpm install --frozen-lockfile`.
3. Configure um banco D1 com o binding `DB` e aplique as migrações de `drizzle/` em ordem. Os identificadores provisórios em vite.config.ts não correspondem a um banco de produção pronto para uso.
4. Configure as variáveis de ambiente abaixo no runtime do Worker. Não coloque segredos no código-fonte nem em arquivos públicos.
5. Execute `pnpm dev` para desenvolvimento, após configurar o ambiente local.
6. Para gerar o build, execute `pnpm build`. A configuração de publicação e os bindings precisam ser ajustados à conta do novo provedor.

A pasta build/ e os scripts fazem parte da integração original com Sites. O arquivo .openai/hosting.json identifica o projeto original; não use esse identificador para publicar um site independente. Preserve o binding DB e configure a publicação de destino separadamente.

## Variáveis de ambiente
- BARBER_USERNAME: nome de usuário do barbeiro.
- BARBER_PASSWORD_SALT: salt inicial usado para o hash da senha.
- BARBER_PASSWORD_HASH: hash PBKDF2-SHA256, 100.000 iterações e 256 bits, em hexadecimal. O algoritmo está em lib/barber-auth.ts.
- BARBER_SESSION_KEY: segredo aleatório para assinar as sessões.

Depois da primeira troca de senha, o hash e o salt atuais ficam na tabela barber_credentials. Nenhuma senha em texto puro é armazenada. Para uma instalação nova, gere novos segredos e configure a senha inicial; este pacote não contém as credenciais de produção.

## Banco de dados e migração
O ZIP NÃO contém os registros do banco de produção. Agendamentos, bloqueios, alterações de serviços, horários, modo de acesso e o hash da senha atual precisam de uma exportação separada caso se queira preservar esses dados.

As migrações criam as tabelas: bookings, slots, service_settings, barber_credentials, site_settings e weekly_hours. Em uma instalação vazia, o código usa os serviços e horários iniciais até que sejam editados no painel.

Mantenha as migrações aplicadas intactas e faça backup dos dados antes de qualquer transferência. Uma mudança de BARBER_SESSION_KEY encerra as sessões existentes.

## Dados da barbearia
Confira WhatsApp, endereço e Pix antes de publicar:
- WhatsApp e endereço aparecem nos componentes em app/.
- A chave Pix e o favorecido ficam em lib/pix.ts.
- As fotos ficam em public/.

## Validação já realizada
A versão exportada passou pelo build de produção e pela verificação de TypeScript. Foram testadas as regras de serviços, preços com centavos, preservação das reservas, senha e sessões, modo privado e horários por dia. O funcionamento em um novo provedor ainda depende da configuração e dos testes naquele ambiente.
