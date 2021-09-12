# syntax=docker/dockerfile:1
FROM debian:bullseye AS polaric-aprsd-build

ENV DEBIAN_FRONTEND=noninteractive
RUN ln -sf /usr/share/zoneinfo/America/Los_Angeles /etc/localtime && \
  apt-get update && apt-get install -y \
    gettext \
    libgettext-commons-java \
    libcommons-codec-java \
    libjackson2-core-java \
    libjackson2-databind-java \
    openjdk-11-jdk-headless \
    scala \
    byacc-j \
    jflex \
    librxtx-java \
    git \
    make \
    libslf4j-java \
  && \
  git clone https://github.com/PolaricServer/aprsd.git /tmp/aprsd

ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF8"
RUN cd /tmp/aprsd && \
    make aprs


FROM debian:bullseye AS polaric-aprsd
ENV DEBIAN_FRONTEND=noninteractive
RUN ln -sf /usr/share/zoneinfo/America/Los_Angeles /etc/localtime && \
  apt-get update && apt-get install --no-install-recommends -y \
    openjdk-11-jre-headless \
    libslf4j-java \
    librxtx-java \
    scala-library \
    scala-xml \
    scala-parser-combinators \
    gettext-base \
    libgettext-commons-java \
    libcommons-codec-java \
    libjackson2-core-java \
    libjackson2-databind-java \
  && \
  rm -rf /var/lib/{apt,dpkg,cache,log}/

RUN mkdir -p \
    /etc/polaric-aprsd/config.d \
    /etc/polaric-aprsd/script-conf.d \
    /etc/polaric-aprsd/scripts \
    /usr/share/polaric \
    /var/lib/polaric \
    /var/log/polaric/backup

COPY --from=polaric-aprsd-build /tmp/aprsd/scripts.conf      /etc/polaric-aprsd
COPY --from=polaric-aprsd-build /tmp/aprsd/trailcolours      /etc/polaric-aprsd
COPY --from=polaric-aprsd-build /tmp/aprsd/view.profiles     /etc/polaric-aprsd
COPY --from=polaric-aprsd-build /tmp/aprsd/symbols           /etc/polaric-aprsd
COPY --from=polaric-aprsd-build /tmp/aprsd/server.ini        /etc/polaric-aprsd
COPY --from=polaric-aprsd-build /tmp/aprsd/passwd            /etc/polaric-aprsd


COPY --from=polaric-aprsd-build /tmp/aprsd/lib/*.jar         /usr/share/java
COPY --from=polaric-aprsd-build /tmp/aprsd/polaric-aprsd.jar /usr/share/java

COPY --from=polaric-aprsd-build /tmp/aprsd/images            /usr/share/polaric/images
COPY --from=polaric-aprsd-build /tmp/aprsd/style.css         /usr/share/polaric

COPY polaric-aprsd-start /usr/bin/

ENTRYPOINT [ "/usr/bin/polaric-aprsd-start" ]

EXPOSE 8081

FROM debian:bullseye AS polaric-webapp2-builder

ENV DEBIAN_FRONTEND=noninteractive
RUN ln -sf /usr/share/zoneinfo/America/Los_Angeles /etc/localtime && \
  apt-get update && apt-get install -y \
    git \
    npm \
    cleancss \
  && \
  rm -rf /var/lib/{apt,dpkg,cache,log}/

WORKDIR /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/* && \
    git clone https://github.com/PolaricServer/webapp2.git . && \
    bash compile-js.sh


FROM nginx AS polaric-webapp2

COPY --from=polaric-webapp2-builder /usr/share/nginx/html /usr/share/nginx/html/

COPY config.js /usr/share/nginx/html/
COPY application.js /usr/share/nginx/html/
COPY index.html /usr/share/nginx/html/