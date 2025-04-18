package:
	docker build \
	--secret id=DATABASE_URL \
	--secret id=AUTH_ZITADEL_ISSUER \
	--secret id=AUTH_ZITADEL_ID \
	--secret id=AUTH_ZITADEL_SECRET \
	--secret id=AUTH_SECRET \
	--secret id=PRISMA_FIELD_ENCRYPTION_KEY \
	-t $(tag):$(version) \
	.

