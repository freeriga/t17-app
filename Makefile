build:; docker-compose build
migrate-maze:; docker-compose run -T maze-api rake db:migrate
