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

Quer que eu te mostre um comando direto para **matar todos os processos do Node** de uma vez (sem precisar ficar olhando PIDs)?
