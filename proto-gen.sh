#!/bin/bash

# yarn proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=src/proto ./src/proto/*.proto

cd src/proto
protoc -I=. ./*.proto \
	--js_out=import_style=commonjs:./ \
	--grpc-web_out=import_style=commonjs,mode=grpcwebtext:./