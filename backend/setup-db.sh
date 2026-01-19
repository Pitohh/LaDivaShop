#!/bin/bash
# Setup script for LaDivaShop backend database

echo "🚀 LaDivaShop Database Setup"
echo "================================"

# Database credentials
DB_NAME="ladivashop"
DB_USER="postgres"
export PGPASSWORD="M@nr0W#23"

# Check if PostgreSQL is running
if ! pg_isready > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Create database
echo "📦 Creating database '$DB_NAME'..."
createdb -h localhost -U $DB_USER $DB_NAME 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "⚠️  Database creation returned code $?. Database may already exist."
fi

# Run migrations
echo "🔄 Running migrations..."
cd "$(dirname "$0")"
npm run migrate

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed"
else
    echo "❌ Migrations failed"
    exit 1
fi

# Run seed data
echo "🌱 Seeding database..."
npm run seed

if [ $? -eq 0 ]; then
    echo "✅ Seed data inserted"
else
    echo "❌ Seeding failed"
    exit 1
fi

# Unset password
unset PGPASSWORD

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "You can now start the server with: npm run dev"
echo "Default admin credentials:"
echo "  Email: admin@ladivashop.com"
echo "  Password: admin123"
