import fp from "fastify-plugin";
import nodemailer from "nodemailer";
const nodemailerPlugin = async (fastify) => {
    const transporter = nodemailer.createTransport({
        host: fastify.config.SMTP_HOST,
        port: fastify.config.SMTP_PORT,
        secure: fastify.config.SMTP_SECURE, // true for 465, false for other ports
        auth: {
            user: fastify.config.SMTP_USER,
            pass: fastify.config.SMTP_PASS,
        },
    });
    // Verify transporter configuration
    try {
        await transporter.verify();
        fastify.log.info("Nodemailer transporter is ready");
    }
    catch (error) {
        fastify.log.error({ err: error }, "Nodemailer transporter verification failed");
    }
    // Decorate fastify instance with nodemailer transporter
    fastify.decorate("mailer", transporter);
};
export default fp(nodemailerPlugin, {
    name: "nodemailer",
    dependencies: ["env"],
});
//# sourceMappingURL=nodemailer.js.map