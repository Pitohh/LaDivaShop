#!/bin/bash
# Script pour configurer l'utilisateur PostgreSQL 'kayto'
# À exécuter avec sudo si nécessaire

echo "🔧 Configuration de l'utilisateur PostgreSQL..."

# Essayer de créer l'utilisateur ou changer son mot de passe
# On utilise sudo -u postgres pour exécuter les commandes admin sans mot de passe postgres
sudo -u postgres psql -c "DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'kayto') THEN
    CREATE USER kayto WITH PASSWORD 'kayto';
    ALTER USER kayto WITH SUPERUSER;
    RAISE NOTICE 'Utilisateur kayto créé';
  ELSE
    ALTER USER kayto WITH PASSWORD 'kayto';
    RAISE NOTICE 'Mot de passe utilisateur kayto mis à jour';
  END IF;
END
\$\$;"

if [ $? -eq 0 ]; then
    echo "✅ Utilisateur 'kayto' configuré avec le mot de passe 'kayto'"
    echo "   Vous pouvez maintenant relancer ./setup-db.sh"
else
    echo "❌ Échec de la configuration automatique."
    echo "   Veuillez exécuter manuellement:"
    echo "   sudo -u postgres psql -c \"ALTER USER kayto WITH PASSWORD 'kayto';\""
fi
