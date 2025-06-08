
export interface Andamento {
  id: string;
  data: string;
  tipo: string;
  descricao: string;
  responsavel: string;
  prazo?: string;
}

export interface Processo {
  numero: string;
  cliente: string;
  tipo: string;
  status: string;
  dataInicio: string;
  responsavel: string;
  descricao: string;
  andamentos: Andamento[];
}

export const mockProcessos: Processo[] = [
  {
    numero: "5005618-35.2023.4.03.6109",
    cliente: "Empresa ABC Ltda",
    tipo: "Tributário",
    status: "Em andamento",
    dataInicio: "2023-03-15",
    responsavel: "Dr. João Silva",
    descricao: "Ação anulatória de débito fiscal referente ao ICMS do exercício de 2022. Contestação de autuação por suposta sonegação fiscal.",
    andamentos: [
      {
        id: "1",
        data: "2023-03-15",
        tipo: "Petição",
        descricao: "Petição inicial protocolada com pedido de liminar para suspensão da exigibilidade do crédito tributário.",
        responsavel: "Dr. João Silva"
      },
      {
        id: "2",
        data: "2023-04-02",
        tipo: "Despacho",
        descricao: "Despacho do magistrado determinando a citação da Fazenda Pública para apresentar contestação.",
        responsavel: "Juiz Federal",
        prazo: "2023-05-02"
      },
      {
        id: "3",
        data: "2023-05-01",
        tipo: "Petição",
        descricao: "Contestação apresentada pela Fazenda Pública impugnando os argumentos da inicial.",
        responsavel: "Procurador da Fazenda"
      }
    ]
  },
  {
    numero: "1002345-67.2023.5.02.0001",
    cliente: "Maria Santos",
    tipo: "Trabalhista",
    status: "Concluído",
    dataInicio: "2023-01-10",
    responsavel: "Dra. Ana Costa",
    descricao: "Reclamação trabalhista por horas extras não pagas e adicional noturno. Processo concluído com acordo.",
    andamentos: [
      {
        id: "4",
        data: "2023-01-10",
        tipo: "Petição",
        descricao: "Reclamação trabalhista inicial ajuizada pleiteando horas extras e adicional noturno.",
        responsavel: "Dra. Ana Costa"
      },
      {
        id: "5",
        data: "2023-02-15",
        tipo: "Audiência",
        descricao: "Audiência de conciliação realizada com proposta de acordo apresentada pela empresa.",
        responsavel: "Juiz do Trabalho"
      },
      {
        id: "6",
        data: "2023-02-15",
        tipo: "Sentença",
        descricao: "Acordo homologado judicialmente com pagamento de R$ 15.000,00 à reclamante.",
        responsavel: "Juiz do Trabalho"
      }
    ]
  },
  {
    numero: "0123456-78.2023.8.26.0100",
    cliente: "José Oliveira",
    tipo: "Cível",
    status: "Aguardando manifestação",
    dataInicio: "2023-05-20",
    responsavel: "Dr. Carlos Mendes",
    descricao: "Ação de cobrança de dívida oriunda de contrato de prestação de serviços não adimplido.",
    andamentos: [
      {
        id: "7",
        data: "2023-05-20",
        tipo: "Petição",
        descricao: "Ação de cobrança ajuizada com pedido de citação do devedor.",
        responsavel: "Dr. Carlos Mendes"
      },
      {
        id: "8",
        data: "2023-06-10",
        tipo: "Intimação",
        descricao: "Intimação para apresentação de tréplica no prazo de 15 dias.",
        responsavel: "Cartório",
        prazo: "2023-06-25"
      }
    ]
  },
  {
    numero: "4001234-56.2023.4.01.3400",
    cliente: "Construtora XYZ S.A.",
    tipo: "Empresarial",
    status: "Prazo em curso",
    dataInicio: "2023-06-01",
    responsavel: "Dr. João Silva",
    descricao: "Ação de dissolução parcial de sociedade empresária com apuração de haveres.",
    andamentos: [
      {
        id: "9",
        data: "2023-06-01",
        tipo: "Petição",
        descricao: "Petição inicial de dissolução parcial de sociedade com pedido de apuração de haveres.",
        responsavel: "Dr. João Silva"
      }
    ]
  },
  {
    numero: "5009876-54.2023.4.03.6109",
    cliente: "Tech Solutions Ltda",
    tipo: "Tributário",
    status: "Em andamento",
    dataInicio: "2023-04-12",
    responsavel: "Dra. Ana Costa",
    descricao: "Mandado de segurança contra exigência de recolhimento de PIS/COFINS sobre receitas não operacionais.",
    andamentos: [
      {
        id: "10",
        data: "2023-04-12",
        tipo: "Petição",
        descricao: "Impetração de mandado de segurança com pedido liminar.",
        responsavel: "Dra. Ana Costa"
      },
      {
        id: "11",
        data: "2023-05-05",
        tipo: "Decisão",
        descricao: "Decisão liminar deferida suspendendo a exigibilidade do tributo.",
        responsavel: "Juiz Federal"
      }
    ]
  },
  {
    numero: "2001111-22.2023.5.15.0001",
    cliente: "Pedro Almeida",
    tipo: "Trabalhista",
    status: "Em andamento",
    dataInicio: "2023-07-08",
    responsavel: "Dr. Carlos Mendes",
    descricao: "Ação de reconhecimento de vínculo empregatício e pagamento de verbas rescisórias.",
    andamentos: [
      {
        id: "12",
        data: "2023-07-08",
        tipo: "Petição",
        descricao: "Reclamação trabalhista para reconhecimento de vínculo empregatício.",
        responsavel: "Dr. Carlos Mendes"
      }
    ]
  },
  {
    numero: "8005555-66.2023.8.09.0001",
    cliente: "Farmácia Popular",
    tipo: "Cível",
    status: "Concluído",
    dataInicio: "2023-02-28",
    responsavel: "Dra. Ana Costa",
    descricao: "Ação indenizatória por danos morais e materiais. Processo julgado procedente.",
    andamentos: [
      {
        id: "13",
        data: "2023-02-28",
        tipo: "Petição",
        descricao: "Ação indenizatória por danos morais e materiais ajuizada.",
        responsavel: "Dra. Ana Costa"
      },
      {
        id: "14",
        data: "2023-04-15",
        tipo: "Sentença",
        descricao: "Sentença de procedência condenando o réu ao pagamento de R$ 25.000,00.",
        responsavel: "Juiz de Direito"
      }
    ]
  },
  {
    numero: "3002222-33.2023.3.01.0001",
    cliente: "Inovação Digital Ltda",
    tipo: "Empresarial",
    status: "Em andamento",
    dataInicio: "2023-05-30",
    responsavel: "Dr. João Silva",
    descricao: "Recuperação judicial com plano de pagamento de credores aprovado em assembleia.",
    andamentos: [
      {
        id: "15",
        data: "2023-05-30",
        tipo: "Petição",
        descricao: "Pedido de recuperação judicial com apresentação do plano de recuperação.",
        responsavel: "Dr. João Silva"
      },
      {
        id: "16",
        data: "2023-07-15",
        tipo: "Decisão",
        descricao: "Decisão deferindo o processamento da recuperação judicial.",
        responsavel: "Juiz de Direito"
      }
    ]
  }
];
