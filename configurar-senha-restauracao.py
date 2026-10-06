from pathlib import Path
import getpass,hashlib,secrets,json
root=Path(__file__).resolve().parent
config=json.loads((root/'configuracao.json').read_text())
username=next((e['value'] for e in config['environment']['entries'] if e['key']=='BARBER_USERNAME' and e['value']), 'kaizen')
password=getpass.getpass('Nova senha do barbeiro (mínimo 8 caracteres): ')
if len(password)<8 or len(password)>128: raise SystemExit('A senha deve ter de 8 a 128 caracteres.')
if password!=getpass.getpass('Confirme a nova senha: '): raise SystemExit('As senhas não são iguais.')
salt=secrets.token_hex(24)
hash_value=hashlib.pbkdf2_hmac('sha256',password.encode(),salt.encode(),100000,32).hex()
values={'BARBER_USERNAME':username,'BARBER_PASSWORD_SALT':salt,'BARBER_PASSWORD_HASH':hash_value,'BARBER_SESSION_KEY':secrets.token_hex(32)}
output=root/'variaveis-restauracao.env'
output.write_text('\n'.join(k+'='+json.dumps(v) for k,v in values.items())+'\n')
output.chmod(0o600)
print('Variáveis geradas em variaveis-restauracao.env. Configure-as como segredos no novo servidor.')
print('Se barber_credentials tiver uma senha alterada salva, ela terá prioridade. Para redefinir também essa senha na nova cópia, faça a atualização dessa tabela no banco de DESTINO. Não altere o site original.')
