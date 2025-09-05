# Principais falhas e informações uteis

Esse erro é clássico no Node:

```
Error: listen EADDRINUSE: address already in use :::3000
```

👉 Significa que a porta **3000 já está em uso**. Ou seja, provavelmente já tem outro processo (talvez até o mesmo `index.js` rodando em segundo plano) ocupando essa porta.

### Como resolver:

1. **Ver qual processo está usando a porta 3000:**

   ```bash
   lsof -i :3000
   ```

   ou

   ```bash
   sudo netstat -tulnp | grep 3000
   ```

   ou ainda

   ```bash
   ss -ltnp | grep 3000
   ```

2. **Matar o processo que está ocupando a porta**
   Depois de identificar o `PID`:

   ```bash
   kill -9 PID
   ```

3. **Tentar rodar novamente**:

   ```bash
   node index.js
   ```

---

### Alternativa: rodar em outra porta

Se você não quiser matar o processo que já está rodando, pode alterar a porta no seu `index.js` (linha onde está `app.listen(3000)`):

```js
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

E rodar na porta **4000** ou qualquer outra livre.

---

⚠️ Dica extra: se isso está acontecendo porque você roda `node index.js` várias vezes, considere usar o **nodemon** (ele reinicia o servidor sem duplicar processos) ou então rodar o projeto em **PM2** se for algo em produção.

---

Beleza, se o `lsof -i :3000` não retornou nada, temos alguns cenários possíveis:

1. **O processo morreu, mas o Node ainda acha que a porta está ocupada** → pode ser que o *socket* tenha ficado em estado *TIME\_WAIT*.
2. **Você está rodando como outro usuário (root por exemplo)** → e o `lsof` não mostra nada sem `sudo`.
3. **É IPv6 (::)** — e às vezes o `lsof` normal não captura.

---

### Vamos investigar melhor:

Tenta esses comandos:

```bash
sudo lsof -iTCP -sTCP:LISTEN -P | grep 3000
```

ou

```bash
sudo ss -ltnp | grep 3000
```

ou ainda:

```bash
sudo netstat -tulnp | grep 3000
```

---

### Se mesmo assim não aparecer nada

Isso indica que a porta ficou “presa” em **TIME\_WAIT**. Nesse caso, basta matar processos Node rodando:

```bash
pkill -f node
```

(⚠️ Isso mata **todos** os processos do Node no servidor.)

Depois tenta rodar de novo:

```bash
node index.js
```

---

Boa! Agora ficou claro o problema 👇

```
node  921  www-data  ...  TCP *:3000 (LISTEN)
```

➡️ Isso significa que já existe um **processo Node rodando na porta 3000**, mas ele está sendo executado pelo usuário **www-data** (típico quando você sobe algo com Nginx/Apache/PM2, ou até systemd).

---

### O que você pode fazer:

#### 1. Encerrar o processo

Pega o **PID** (no caso `921`) e mata ele:

```bash
sudo kill -9 921
```

Depois tenta rodar de novo:

```bash
node index.js
```

---

#### 2. Se não quiser matar

Pode simplesmente rodar sua aplicação em outra porta.
No seu `index.js`, troque a linha:

```js
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
```

por algo como:

```js
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

e rode em `http://localhost:4001`.

---

#### 3. Extra (se o processo não era “seu”)

Se esse Node que está rodando pelo usuário `www-data` é algo que você configurou (tipo um serviço), vale checar se não está **já rodando como daemon via systemd ou PM2**.

* PM2:

  ```bash
  pm2 list
  ```
* Systemd:

  ```bash
  systemctl status myapi.service
  ```

---

## Liberando Acesso

Aham! Agora ficou bem claro 👇

No teu `index.js` o servidor está assim:

```js
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
```

👉 Isso significa que o Express **só está escutando em `localhost`**, ou seja, apenas dentro da própria máquina.
De fora da rede (ou de outro computador), você nunca vai conseguir acessar — e isso explica porque o browser não abre a página.

---

### ✅ Como corrigir

Basta trocar o trecho final para que ele escute em todas as interfaces (`0.0.0.0`):

```js
app.listen(port, "0.0.0.0", () => {
    console.log(`API rodando em http://0.0.0.0:${port}`);
});
```

Assim, qualquer cliente na rede que tentar acessar `http://<IP_DO_SERVIDOR>:3000` vai conseguir conectar.

---

### 🚀 Passos depois da alteração

1. Edita o `index.js` e salva a modificação.

2. Reinicia o serviço:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl restart node-server-webfinancas.service
   ```

3. Testa dentro do servidor:

   ```bash
   curl http://localhost:3000
   ```

   → Deve responder com o texto `"Bem-vindo à API!..."`.

4. Testa de outro computador na rede:

   ```
   http://192.168.1.xxx:3000
   ```

---

⚠️ Obs.: como você já está usando CORS configurado para `http://192.168.1.100:9874`, parece que o frontend está rodando nessa máquina. Ou seja, com o ajuste do `0.0.0.0` deve casar certinho com seu frontend.

---

Quer que eu já te monte a versão “corrigida” do final do teu `index.js` (com `0.0.0.0`) e o comando para **logar em tempo real** os erros do serviço com `journalctl -f` enquanto você testa do navegador?



