# Configuration des Providers OAuth Supabase

## Erreur actuelle
L'erreur `Unsupported provider: provider is not enabled` signifie que les providers OAuth ne sont pas configurés dans votre projet Supabase.

## Étapes pour configurer les providers

### 1. Accéder à la console Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet

### 2. Configurer Google OAuth
1. Allez dans **Authentication** > **Providers**
2. Trouvez **Google** et cliquez sur **Configure**
3. Activez le provider
4. Ajoutez vos identifiants :
   - **Client ID** : Votre ID client Google OAuth
   - **Client Secret** : Votre secret client Google OAuth
5. Ajoutez l'URL de redirection :
   ```
   http://localhost:3000/auth/callback
   ```
   (remplacez 3000 par le port de votre application)

### 3. Obtenir les identifiants Google
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez-en un
3. Allez dans **APIs & Services** > **Credentials**
4. Créez **OAuth 2.0 Client IDs**
5. Configurez :
   - **Application type** : Web application
   - **Authorized redirect URIs** : `http://localhost:3000/auth/callback`
6. Copiez le **Client ID** et **Client Secret**

### 4. Configurer Facebook OAuth
1. Dans la console Supabase, trouvez **Facebook** et cliquez sur **Configure**
2. Activez le provider
3. Ajoutez vos identifiants Facebook :
   - **App ID** : Votre ID d'application Facebook
   - **App Secret** : Votre secret d'application Facebook
4. Ajoutez l'URL de redirection valide

### 5. Obtenir les identifiants Facebook
1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une nouvelle application
3. Allez dans **Settings** > **Basic**
4. Ajoutez **Facebook Login** product
5. Configurez les **Valid OAuth Redirect URIs** :
   ```
   http://localhost:3000/auth/callback
   ```

### 6. Configurer GitHub OAuth
1. Dans la console Supabase, trouvez **GitHub** et cliquez sur **Configure**
2. Activez le provider
3. Ajoutez vos identifiants GitHub :
   - **Client ID** : Votre ID client GitHub OAuth
   - **Client Secret** : Votre secret client GitHub OAuth
4. Ajoutez l'URL de redirection

### 7. Obtenir les identifiants GitHub
1. Allez sur [GitHub Settings](https://github.com/settings/developers)
2. Cliquez sur **OAuth Apps** > **New OAuth App**
3. Configurez :
   - **Application name** : Nom de votre application
   - **Homepage URL** : `http://localhost:3000`
   - **Authorization callback URL** : `http://localhost:3000/auth/callback`
4. Générez un nouveau **Client Secret**

## Configuration du code (déjà faite)

Le code JavaScript est déjà configuré correctement :

```javascript
const handleSocialLogin = async (provider) => {
  setLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard-visitor`
      }
    });
    
    if (error) throw error;
  } catch (error) {
    console.error(`Erreur connexion ${provider}:`, error);
    showNotification(`Erreur lors de la connexion avec ${provider}`, 'error');
  } finally {
    setLoading(false);
  }
};
```

## URLs de redirection importantes

Pour le développement local :
- **Development** : `http://localhost:3000/auth/callback`
- **Production** : `https://votredomaine.com/auth/callback`

## Test après configuration

Une fois les providers configurés dans Supabase :
1. Redémarrez votre application
2. Essayez de vous connecter avec Google/Facebook/GitHub
3. Vérifiez que la redirection fonctionne correctement

## Dépannage

Si l'erreur persiste :
1. Vérifiez que les providers sont bien **activés** (toggle vert)
2. Vérifiez les **URLs de redirection** dans Supabase et les consoles des providers
3. Assurez-vous que les **identifiants** sont corrects
4. Vérifiez la **console** Supabase pour d'autres erreurs
