/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/
'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { getContractInstance, disconnect } = require('../util/networkutil');

//create legal entity object structure form Client Central format
//const clientId = '10028067';
const clientId = '55555555';
const TAX_CLASSIFICATION = {
    CRS: {
        CRSElectronicSearchDate: {
           
        },
        TaxControllingPersonType: {
           
        },
        CRSTaxFormType: "CRSSCFENT",
        Comments: {
           
        },
        TaxDocumentStatus_LOVDesc: {
           
        },
        CRSClassificationStatus: "APPRVD",
        TaxControllingPersonType_LOVDesc: {
           
        },
        IsCRSCAR: "N",
        CRSTaxFormType_LOVDesc: "CRS Self Certification Form - Entity",
        CRSClassificationStatus_LOVDesc: "Approved",
        CRSEntityType_LOVDesc: "Active NFE - A Central Bank",
       TaxFormReceivedDate: "2020-11-20T00:00:00",
       CRSEnhancedReviewDate: {
           
        },
       PlaceOfIncorporation: {
           
        },
       TaxDocumentStatus: {
           
        },
       TaxFormSignedDate: "2020-10-26T00:00:00",
       CRSEntityType: "ANFE-CB"
    },
   FATCA: {
       Comments: {
           
        },
       ExemptionReasonFrom871M: {
           
        },
       TreatyArticle: "Treaty",
       USOnshoreObligations: "N",
       ExemptionReasonFrom871M_LOVDesc: {
           
        },
       ProtocolInPlace: {
           
        },
       TreatyTypeOfIncome: 10000,
       TreatyWithholdingRate: 15,
       USTaxNextReviewDate: "2023-11-30T00:00:00",
        USIndicia: 1,
        IsCh4CAR: {
           
        },
        Chapter4: {
            NameOfSponsoringEntity: {
               
            },
            RecalcitrantUndocumentedAssignedDate: {
               
            },
            USTaxClassificationStatus_LOVDesc: {
               
            },
            Chapter4FATCAStatus: 19,
            BankruptcyDate: "2020-11-20T00:00:00",
            USTaxPersonStatus: "N-US-PER",
            W9ExemptPayeeCode: {
               
            },
            RecalcitrantUndocumentedClearedDate: {
               
            },
            FederalTaxClassificationCode: {
               
            },
            W9ExemptionFromFATCAReportingCode: {
               
            },
            USTaxClassificationStatus: {
               
            },
            StartupDate: {
               
            },
            W9ExemptPayee_LOVDesc: {
               
            },
            W9ExemptionFromFATCAReporting_LOVDesc: {
               
            },
            SubstantialUSOwnersOrControllingPersons: {
               
            },
            ReferenceNumber: {
               
            },
            RecalcitrantFlag: 0,
            FederalTaxClassification_LOVDesc: {
               
            },
            Chapter4FATCAStatus_LOVDesc: "Excepted nonfinancial entity in liquidation or bankruptcy",
            StatusExpiryDate: "2023-11-30T00:00:00",
            USTaxPersonStatus_LOVDesc: "Non U.S. Person (871M)"
        },
        TaxForm: {
            MD3ValidationResult: "VLD",
            MD3ValidationResult_LOVDesc: "Valid",
            TaxDocumentStatus_LOVDesc: {
               
            },
            USTaxFormType: "W-8BEN-E",
            TaxFormReceivedDate: "2020-11-20T00:00:00",
            TaxDocumentStatus: {
               
            },
            TaxFormSignedDate: "2020-11-30T00:00:00",
            USTaxFormType_LOVDesc: "W-8BEN-E",
            TaxFormExpiryDate: "2023-11-30T00:00:00"
        },
        Chapter3: {
            QualifiedIntermediaryType: {
               
            },
            LimitationOnBenefitsProvisionTypeOther: {
               
            },
            Chapter3Status_LOVDesc: "Central bank of issue",
            Chapter3Status: 18,
            BeneficialOwnerWithTreatyClaims: {
               
            },
            WithholdingPercentage: 10,
            LimitationOnBenefitsProvisionType: "COMPBASEDERIVTEST",
            LimitationOnBenefitsProvisionType_LOVDesc: "Company that meets the derivative benefits test",
            CountryOfTaxTreaty_LOVDesc: "Australia",
            W8IMYEffectiveRateOfWithholdiing: {
               
            },
            IsThisEntityHybridMakingTreatyClaim: "Y",
            QualifiedIntermediaryType_LOVDesc: {
               
            },
            CountryOfTaxTreaty: "AU",
            LimitationOnBenefitsProvisionTypeOther_LOVDesc: {
               
            }
        },
        ProtocolDate: {
           
        },
        TreatyExplanation: "test",
        TreatyClaimExpiryDate: "2023-12-31T00:00:00",
        ExemptFrom871M: {
           
        }
    }
}
const TAX_IDENTIFIER = {
        TaxIdentifier: {
            TaxIdentifierType_LOVDesc: "TIN",
            LastUpdatedBy: 1131670,
            Comments: "test",
            SourceOfTaxID: "ST-UST",
            CRSReportable: 0,
            SourceOfTaxID_LOVDesc: "US Tax",
            InvalidReason_LOVDesc: {
               
            },
            TaxIdentifierStatus_LOVDesc: "Valid",
            InvalidReason: {
               
            },
            LastUpdatedDate: "2020-11-20T07:21:22",
            SequenceNumber: 4347,
            ReasonNumberNotProvided_LOVDesc: {
               
            },
            CountryOfTaxResidence: {
               
            },
            TaxIdentifierType: "TIN",
            TaxIdentifierStatus: "VLD",
            RowVersion: "tIWxDI1WFJfgU9LCxgq/4Q==",
            CreatedBy: 1131510,
            CreatedDate: "2020-11-20T07:15:29",
            TaxIdentifierProvided: 1,
            TaxIDNumber: 12345678999,
            CountryOfTaxIDIssue: "AU",
            ReasonNumberNotProvided: {
               
            }
        },
    PreTax: {
        ClientAnticipateReceivingPaymentsOfUSSourcedIncome: {
           
        },
        ClientOpeningAccountInUSBranch: "N",
        ClientHasStandingInstructionsToUS: "Y",
        DoesTheClientHaveUSTelephoneNumber: "N",
        ClientHasCareOfOrHoldMailAddress: "Y",
        PlaceOfIncorporation: {
           
        },
        HaveUSTaxFormFromClient: "Y",
        ClientHasPOAWithUSAddress: "N"
    }
}
const ESRA= {
    Comments: {
        
    },
    OverallReason: {
        
    },
    ESRAOverallOutcome: {
        
    },
    ESRAAdvisorReviewRequired: {
        
    },
    Recommendation_LOVDesc: {
        
    },
    SupportConditions: {
        
    },
    ESRANextReviewDate: {
        
    },
    ESRAStatus: "NOTINSCOP",
    ESRAOverallOutcome_LOVDesc: {
        
    },
    Recommendation: {
        
    },
    AssessmentNote: {
        
    },
    SupportConditions_LOVDesc: {
        
    },
    ESRAStatus_LOVDesc: "Not in Scope",
    ESRAAdvisorSupportingComments: {
        
    }
}

const CDDAMLSCREENING = {
    AMLScreening: {
        LastUpdatedBy: 1016506,
        ScreeningResult: "No Match",
        ScreeningTypeHitCategory: "",
        GNSAssessmentDate: "2020-11-20T07:40:20",
        TypeOfScreening: "GNS",
        ScreeningRequestDate: "2020-11-20T07:40:22",
        LastUpdatedDate: "2020-11-19T11:19:49",
        ScreeningTypeHitCategory_LOVDesc: "",
        GNSConsolidatedStatus_LOVDesc: "No match",
        ScreeningStatus_LOVDesc: "Completed",
        TypeOfScreening_LOVDesc: "GNS Screening",
        GNSScreening: {
            PEPSummary: {
                InitialResponse_LOVDesc: "No match",
                InitialResponse: "NOMAT"
            },
            SanctionsSummary: {
                InitialResponse_LOVDesc: "No match",
                InitialResponse: "NOMAT"
            },
            AdverseMediaSummary: {
                InitialResponse_LOVDesc: "No match",
                InitialResponse: "NOMAT"
            }
        },
        RowVersion: "tHTUK/nHYZDgU9LCxgq+6g==",
        CreatedBy: 1016506,
        CreatedDate: "2020-11-19T11:19:49",
        GNSScreeningStatus: "COMPL",
        ScreeningStatus: "COMPL",
        GNSScreeningStatus_LOVDesc: "Completed",
        ScreeningResult_LOVDesc: "No Match",
        GNSConsolidatedStatus: "No match"
    }
}

const CUSTOMERINFO = {
    LegalEntityType: "P9",
    LegalEntityName: "Guarantor",
    InternalIdentifier: {
    DMUIdentifiers: {
        DMUIdentifier: {
            LastUpdatedBy: "System",
            TargetSystem: 14768,
            BusinessEntityType: "LegalEntity",
            SequenceNumber: 8784,
            IsPrimary: 1,
            LastUpdatedDate: "2020-11-20T06:12:00",
            TargetSystemSubID: 4,
            TargetSystem_LOVDesc: "SCI",
            TargetSystemID: 13826283,
            SourceSystem_LOVDesc: 50752,
            SourceSystem: 50752
        }
    },
    Identifiers: {
        Identifier: {
            LastUpdatedBy: 1117993,
            SystemName_LOVDesc: "Workbench",
            SystemName: "CRM-PRSPID",
            RowVersion: "tEefurPHE1zgU8jCxgoylg==",
            CreatedDate: "2020-11-17T05:19:31",
            CreatedBy: 1117993,
            LastUpdatedDate: "2020-11-17T05:19:31",
            SequenceNumber: 16660,
            SystemRefID: 1008118962
            }
        }
    }
}

// Main program function
async function main() {

    try {
        const contract = await getContractInstance();

        console.log('Submit customer creation transaction.');
        // contactId,user,phone,email,status,organization,role
        console.log("********************************************************************")
        const customerBuffer = await contract.submitTransaction("createCustomer",clientId,JSON.stringify(CUSTOMERINFO));
        let newCustomer = JSON.parse(customerBuffer.toString());
        console.log(`${newCustomer.clientId} ...customer info .. .successfully created`);
        console.log("********************************************************************")
        const customerCDDScreening = await contract.submitTransaction("customerCDDScreening","CDDSCREENING_"+clientId,JSON.stringify(CDDAMLSCREENING));
        let newCustomerCDDScreening = JSON.parse(customerCDDScreening.toString());
        console.log(`${newCustomerCDDScreening} ....cdd screening... successfully created`);
        console.log("********************************************************************")
        //TAX_CLASSIFICATION
        const taxClassification = await contract.submitTransaction("customerCDDScreening","TAX_CLASSIFICATION_"+clientId,JSON.stringify(TAX_CLASSIFICATION));
        let customerTaxClassification = JSON.parse(taxClassification.toString());
        console.log(`${customerTaxClassification} ..tax classification..successfully created`);
        console.log("********************************************************************")
        //TAX_IDENTIFIER
        const taxIdentifier = await contract.submitTransaction("customerCDDScreening","TAX_IDENTIFIER_"+clientId,JSON.stringify(TAX_IDENTIFIER));
        let customerTaxIdentifier = JSON.parse(taxIdentifier.toString());
        console.log(`${customerTaxIdentifier} .. taxidentifier ..successfully created`);
        console.log("********************************************************************")
        //ESRA
        const esra = await contract.submitTransaction("customerCDDScreening","ESRA_"+clientId,JSON.stringify(ESRA));
        let customerEsra = JSON.parse(esra.toString());
        console.log(`${customerEsra} ...esra .successfully created`);
        console.log("********************************************************************")

        console.log('Transaction complete.');
        return "";

    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        disconnect();
    }
}


//main('12334234','test test test').then(() => {
main().then(() => {
    console.log('Contact created successfully.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});


