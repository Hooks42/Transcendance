start:
	docker compose up -d

stop:
	docker compose down

clean:
	docker compose down -v

cleanall:
	docker system prune -af
	docker kill $(docker ps -q)

logs:
	docker compose logs -f
