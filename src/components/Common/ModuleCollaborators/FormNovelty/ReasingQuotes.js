import React from 'react'

import QuoteForm from './QuoteForm';

const ReasingQuotes = ({ quotes, setQuotes }) => {

    const handleChangeManagers = (data, currentId) => {
        setQuotes(quotes => quotes.map((quote) => {
            if(quote.id === currentId) {
                return { ...quote, optional_medical_id: data || [] }
            }
            return quote
        }))
    }

    return (  
        <>
            { quotes && quotes.map((quote, idx) => (
                <QuoteForm key={idx} managersSelect={quote?.optional_medical_id} availableManagers={quote?.optionals_medicals || []} indexSchedule={idx+1} quote={quote} handleChangeManagers={handleChangeManagers} />
            ))}
        </>
    );
}

export default ReasingQuotes;