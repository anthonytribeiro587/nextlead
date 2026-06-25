# NextLead - Landing integrada ao CRM

Esta versão mantém o visual da landing e adiciona um formulário conectado ao CRM NextLead.

## Endpoint usado

`https://nextlead-crm.vercel.app/api/leads`

## Fluxo

Formulário da landing → CRM NextLead → Supabase → Funil comercial → redirecionamento opcional para WhatsApp.

## Configuração opcional

Se você ativar `NEXTLEAD_LEADS_API_KEY` no CRM, edite `script.js` e preencha:

```js
const NEXTLEAD_LEADS_API_KEY = 'SUA_CHAVE_AQUI';
```

Como você configurou `NEXTLEAD_ALLOWED_ORIGINS=*`, esta landing já consegue enviar os leads para a API.
