beforeEach(() => {
  cy.visit('./src/index.html')
})

describe('Central de Atendimento ao Cliente TAT', () => {
  it('verifica o título da aplicação', () => {
    cy.title()
      .should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    cy.get('#firstName')
      .type('Claire')
    
    cy.get('#lastName')
      .type('Dunphy')
    
    cy.get('#email')
      .type('cdunphy@gmail.com')
      
    cy.get('#open-text-area')
      .type('Nenhum, obrigada.', {
        delay: 50,
    })

    cy.get('.button')
      .click()

    cy.get('.success')
      .should('be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName')
      .type('Phil')
    
    cy.get('#lastName')
      .type('Dunphy')
    
    cy.get('#email')
      .type('pdunphy')
      
    cy.get('#open-text-area')
      .type('Nenhum, obrigado.')

    cy.get('.button')
      .click()

    cy.get('.error')
      .should('be.visible')
  })

  it('não preenche valor não-numérico em telefone', () => {
    cy.get('#phone')
      .type('Not a number')
    
    cy.get('input')
      .should('not.have.value', 'Not a number')
  })

  it('erro ao telefone se tornar obrigatório e não ser preenchido', () => {
    cy.get('#firstName')
      .type('Alex')
    
    cy.get('#lastName')
      .type('Dunphy')
    
    cy.get('#email')
      .type('adunphy@gmail.com')
      
    cy.get('#open-text-area')
      .type('Nenhum, obrigada.')

    cy.get('#phone-checkbox')
      .click()

    cy.get('.button')
      .click()

    cy.get('.error')
      .should('be.visible')
    
    cy.get('input')
      .should('not.have.value', 'Not a number')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Haley')
      .should('have.value', 'Haley')
    cy.get('#firstName')
      .clear()
      .should('have.value', '')
    
    cy.get('#lastName')
      .type('Dunphy')
      .should('have.value', 'Dunphy')
    cy.get('#lastName')
      .clear()
      .should('have.value', '')
    
    cy.get('#email')
      .type('hdunphy@gmail.com')
      .should('have.value', 'hdunphy@gmail.com')
    cy.get('#email')
      .clear()
      .should('have.value', '')
    
    cy.get('#phone')
      .type('999999999')
      .should('have.value', '999999999')
    cy.get('#phone')
      .clear()
      .should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.get('.button')
      .click()

    cy.get('.error')
      .should('be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    const data = {
      firstName: 'Luke',
      lastName: 'Dunphy',
      email: 'ldunphy@gmail.com',
      text: 'Teste.'
    }
    cy.fillMandatoryFieldsAndSubmit(data)

    cy.get('.success')
      .should('be.visible')
  })
  
  it('identificar botões', () => {
    cy.contains('.button', 'Enviar')
      .click()
  })
  
  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('select')
      .select('YouTube')

    cy.get('select')
      .should('have.value', 'youtube')
  })
  
  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('select')
      .select('mentoria')

    cy.get('select')
      .should('have.value', 'mentoria')
  })
  
  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('select')
      .select(1)

    cy.get('select')
      .should('have.value', 'blog')
  })
  
  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('be.checked')
  })
  
  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .each(typeOfService => {
        cy.wrap(typeOfService)
          .check()
          .should('be.checked')
      })
  })
  
  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .each(typeOfService => {
        cy.wrap(typeOfService)
          .check()
          .should('be.checked')
      })
    
    cy.get('input[type="checkbox"]')
      .last()
      .uncheck()
      .should('not.be.checked')
  })
  
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#phone-checkbox')
      .check()
      .should('be.checked')
    
    const data = {
      firstName: 'Mitchell',
      lastName: 'Prichett',
      email: 'mprichett@gmail.com',
      text: 'Teste.'
    }
    cy.fillMandatoryFieldsAndSubmit(data)

    cy.get('.error')
      .should('be.visible')
  })
  
  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/example.json')
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })
  
  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })
  
  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json')
      .as('sampleFile')

    cy.get('input[type="file"]')
      .selectFile('@sampleFile')
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })
  
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.contains('a', 'Política de Privacidade')
      .should('have.attr', 'href', 'privacy.html')
      .and('have.attr', 'target', '_blank')
  })
  
  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('a')
      .invoke('removeAttr', 'target').click()

    cy.contains('h1', 'CAC TAT - Política de Privacidade')
      .should('be.visible')
  })

  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche o campo da área de texto usando o comando invoke', () => {
    cy.get('#open-text-area')
      .invoke('val', 'Um texto qualquer')
      .should('have.value', 'Um texto qualquer')
  })

  it('faz uma requisição HTTP', () => {
    cy.request('https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html')
      .as('getRequest')
      .its('status')
      .should('be.equal', 200)

    cy.get('@getRequest')
      .its('statusText')
      .should('be.equal', 'OK')

    cy.get('@getRequest')
      .its('body')
      .should('be.include', 'CAC TAT')
  })

  it('encontra o gato escondido', () => {
    cy.get('#cat')
      .invoke('show')
      .should('be.visible')

    cy.get('#title')
      .invoke('text', 'CAT TAT')

    cy.get('#subtitle')
      .invoke('text', 'Meow!')
  })
})