# ใช้ Node base image ที่เบา
FROM node:23-alpine

# สร้าง working directory
WORKDIR /app

# คัดลอกไฟล์และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอก source code
COPY . .

# สร้าง production build
RUN npm run build

# เปิดพอร์ตที่ NestJS ใช้
EXPOSE 3000

# สั่งรัน backend
CMD ["node", "dist/main"]
