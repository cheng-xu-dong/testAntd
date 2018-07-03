# 使用 node 8.11.1 作为基础镜像
FROM registry.cn-hangzhou.aliyuncs.com/sovell-io/nginx-base:latest

# 安装nginx
#RUN apt-get update \
#		&& apt-get install -y nginx

# 安装node
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash - \
		&& yum install nodejs

#RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
#ADD nginx.conf /etc/nginx/

# 声明运行时容器提供的服务器接口

# 1.安装依赖
# 2.运行 npm run buil
# 3.将 dist 目录的所有文件拷贝到 nginx 的目录下
# 4.删除工作目录的文件，尤其是 node_modules 以减小镜像体积
# 由于镜像构建的每一步都会产生新层
# 为了减小镜像体积，尽可能将一些同类操作，集成到一个步骤中，如下
RUN npm install \
		&& npm run build \
	  && mkdir -p /usr/local/nginx/html/sovell-lachesis-static-microrestaurant/wap \
	  && cp -r dist/* /usr/local/nginx/html/sovell-lachesis-static-microrestaurant/wap