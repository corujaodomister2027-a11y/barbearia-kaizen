# Entrega da Kaizen Barbearia

## Arquivos entregues
- codigo/: projeto completo e imagens.
- banco/kaizen.sqlite: banco limpo, com serviços e configurações disponíveis na captura.
- banco/restaurar-banco.sql: esquema e dados para restauração em banco novo.
- banco/dados.json: cópia legível das informações salvas.
- banco/configuracao.json: variáveis recuperáveis e relação dos segredos a recriar.
- banco/configurar-senha-restauracao.py: criação da nova senha inicial e chaves de sessão para a instalação de destino.
- LEIA-ME-BACKUP.md: detalhes e limitações da restauração.

Os agendamentos fictícios foram retirados do banco entregue. Horários sem personalização continuam usando o padrão: terça a sábado, 17h às 21h. O banco mantém os quatro serviços cadastrados.

## Endereços atuais
Site: https://kaizen-barbearia.sound-cedar-1604.chatgpt.site
Painel: botão “Área do barbeiro” no site; o login usa o usuário configurado em banco/configuracao.json. A senha deve ser enviada separadamente pelo responsável atual. Não compartilhe a conta pessoal do ChatGPT.

## Como operar
1. Entre na Área do barbeiro.
2. Em Serviços e preços, edite os nomes, preços e duração. Para criar outra opção, clique Adicionar serviço e depois Salvar serviços.
3. Em Horários de atendimento, marque os dias abertos, defina a abertura e o fechamento e clique Salvar horários. Os intervalos são de 30 minutos.
4. Em Acesso ao site, alterne entre público e privado. No privado, visitantes veem apenas um aviso, mas o barbeiro pode continuar entrando pelo login.
5. Em Senha de acesso, informe a senha atual, a nova senha e a confirmação. Outros acessos são encerrados.
6. Em Pagamentos pendentes, confira o Pix no aplicativo do banco antes de confirmar. O site não verifica automaticamente se o dinheiro foi recebido.
7. Em Agenda do dia, selecione a data para consultar as reservas. Use Bloquear um horário para reservar uma pausa.
8. Antes de iniciar o uso oficial do site atual, clique Excluir os testes identificados e confirme. Isso remove somente os oito registros fictícios identificados; os novos agendamentos permanecem.

## Hospedagem em outro lugar
As funções do painel fazem parte do código e podem continuar funcionando em outra hospedagem. É necessário instalar o servidor, restaurar o banco e configurar as credenciais. Copiar somente HTML ou imagens não instala o sistema.

Este projeto usa Cloudflare Workers/D1, React, TypeScript e Vinext. O instalador deve confirmar a compatibilidade do provedor e adaptar a integração se necessário. O pacote não constitui uma migração já executada. O dono deve criar a conta de hospedagem e o domínio na própria titularidade e manter acesso à cobrança e à recuperação da conta.

## Antes de colocar em uso oficial
- Confira a chave Pix e o favorecido em codigo/lib/pix.ts. A configuração atual contém dados do responsável original; substitua pelos dados autorizados do dono antes da instalação definitiva.
- Confira o WhatsApp, o endereço e o Instagram.
- Defina e guarde a senha de acesso de forma privada.
- Teste um agendamento completo, o envio de comprovante e a confirmação manual.
- Teste um serviço longo para confirmar o cálculo de disponibilidade.
- Teste o modo privado em outro navegador sem login.
- Combine por escrito o valor da entrega, o período de suporte, a manutenção e quem paga a hospedagem e o domínio. Esses termos não são definidos pelo pacote.

## Uso do painel e mudanças futuras
O painel altera serviços, preços, duração, dias de atendimento, horários, senha e acesso público. Alterações no visual, fotos, textos institucionais, chave Pix e outras partes do projeto exigem edição do código; não há um editor visual completo no painel.

## Backups
Guarde este ZIP em pelo menos dois lugares privados. Esta é uma cópia da captura; novos agendamentos e mudanças futuras não entram automaticamente nela. Faça backups periódicos do banco e do código. A exportação não contém os segredos originais da hospedagem: é necessário recriá-los ao restaurar, conforme o procedimento incluído.
