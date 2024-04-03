## Como fazer o deploy?

A aplicação suporta 2 temas:

- Agille
- Agiprev

É necessário repetir o procedimento para cada tema

Gere o build da aplicação:

```bash
# instalar dependencias
yarn
# aplicar tema (agille ou agiprev)
yarn apply-theme agille
# gerar build
yarn build
```

Use o seguinte comando para zipar a pasta de build (gerada no passo anterior):

`tar -x -f build.zip build`

Copie os arquivos para o servidor:

`pscp -i keys/Agille-SSH-Key.ppk build.zip ec2-user@ec2-3-239-212-228.compute-1.amazonaws.com:/home/ec2-user/build`

Acesse remotamente o servidor, extraindo os arquivos para a respectiva pasta:

Agille -> /usr/share/nginx/html/agille.digital
Agiprev -> /usr/share/nginx/html/agiprev.digital

```bash
unzip ~/build/build.zip
cp -r ~/build/build/* /usr/share/nginx/html/agille.digital
```
