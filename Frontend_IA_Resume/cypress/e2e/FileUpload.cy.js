describe('Subida de video y descarga automática', () => {
  it('Debería subir video y descargar transcripción y resumen automáticamente', () => {
    cy.intercept('POST', '/api/get/video').as('uploadVideo');

    cy.visit('http://localhost:5173');

    cy.get('input[type="file"]').selectFile('cypress/fixtures/video.mp4', { force: true });

    cy.wait('@uploadVideo', { timeout: 600000 }) // 10 minutos
      .then(({ request, response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.property('transcription').and.be.a('string');
        expect(response.body).to.have.property('summary').and.be.a('string');
      });
  });
});
