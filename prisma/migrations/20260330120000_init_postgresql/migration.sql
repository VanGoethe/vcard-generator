-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "jobtitle" TEXT NOT NULL,
    "linkedin" TEXT,
    "phoneNumber" VARCHAR(277) NOT NULL,
    "image_url" TEXT,
    "card_background_color" VARCHAR(15) NOT NULL,
    "card_text_color" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
