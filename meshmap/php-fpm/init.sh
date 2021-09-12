#!/bin/bash

sed -e "s/sql_user = \".*\"/sql_user = \"${MARIADB_USER}\"/" \
       -e "s/sql_passwd = \".*\"/sql_passwd = \"${MARIADB_PASSWORD}\"/" \
    /config/user-settings.ini > /app/scripts/user-settings.ini

cp /config/meshmap-settings.ini /app/scripts

case $1 in
	update)
	  echo "Running Update Cron Job"
		cd /app/scripts
		./get-map-info.php --test-mode-with-sql
		;;
	*)
		exec php-fpm -F --pid /opt/bitnami/php/tmp/php-fpm.pid -y /opt/bitnami/php/etc/php-fpm.conf
		;;
esac
