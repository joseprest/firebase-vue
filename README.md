# frontend

## Configuration de l'environnement

Par défaut la config Firebase de développement est utilisé. Pour utiliser la config Firebase
de prod en mode développement, il suffit d'ajouter un fichier .env.local 
avec la valeur `VUE_APP_PROD_CONFIG=yes`.

Se souvenir qu'il faut redémarrer le serveur de développement lorsqu'on
change une valeur dans les .env*.

## Configuration du CI/CD

En utilisant `npm run build`, la config Firebase de prod sera automatiquement utilisée.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
