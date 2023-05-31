# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: balkis-wang <balkis-wang@student.42.fr>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/09/21 12:27:55 by bben-yaa          #+#    #+#              #
#    Updated: 2023/05/30 22:53:24 by balkis-wang      ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

			
all		:
			docker-compose up --build

#	-> je lance docker compose avec le fichier .env

clean:
	rm -rf postgres_data
	docker system prune -af

down	:
			docker-compose down
#				L-> stops containers 

re		:	down clean all

.PHONY : all clean logs down re
