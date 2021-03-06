import { useState, useEffect } from 'react'
import cn from 'classnames'

export default function Filter({ entries, filterEntries, sortEntries }) {
    const [active, setActive] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [clear, setClear] = useState(false);
    const [length, setLength] = useState();
    const [publication, setPublication] = useState();
    const [lengthOptions, setLengthOptions] = useState(['Any', '0-2 min', '2-5 min', '5-8 min', '8+ min']);
    const [publicationOptions, setPublicationOptions] = useState([...new Set(['Any'].concat(entries.map((post) => post.publication)))]);
    const [sortOptions, setSortOptions] = useState([
        {
            key: 0,
            description: 'Date Desc',
            fn: () => (post1, post2) => (post1.date > post2.date ? '-1' : '1'),
        },
        {
            key: 1,
            description: 'Date Asc',
            fn: () => (post1, post2) => (post1.date > post2.date ? '1' : '-1'),
        },
        {
            key: 2,
            description: 'Read Time Desc',
            fn: () => (post1, post2) => (post1.readTime > post2.readTime ? '-1' : '1'),
        },
        {
            key: 3,
            description: 'Read Time Asc',
            fn: () => (post1, post2) => (post1.readTime > post2.readTime ? '1' : '-1'),
        },
    ])
    const [sortSelected, setSortSelected] = useState(sortOptions[0]);
    const [partnerOnly, setPartnerOnly] = useState(false);
    const [submittedOnly, setSubmittedOnly] = useState(false);

    useEffect(() => {
        filterChanges();
    }, [length, publication, partnerOnly, submittedOnly, clear])

    const filterChanges = () => {
        let filtered = entries;
        if (length) {
            if (length !== "Any") {
                if (length === "8+ min") filtered = filtered.filter(post => post.readTime > 8)
                else {
                    let bounds = length.split('-');
                    let lower = bounds[0];
                    let upper = bounds[1];
                    filtered = filtered.filter(post => lower <= post.readTime && post.readTime <= upper);
                }
            }
        }

        if (publication && publication !== "Any") {
            filtered = filtered.filter(post => post.publication == publication)
        }

        if (partnerOnly) {
            filtered = filtered.filter(post => post.partnered === "1")
        }

        if (submittedOnly) {
            filtered = filtered.filter(post => post.submitted === "1")
        }

        if (startDate && endDate) {
            let s = Date.parse(startDate);
            let e = Date.parse(endDate);
            filtered = filtered.filter(post => s <= Date.parse(post.date) && Date.parse(post.date) <= e)
        }

        filterEntries(filtered);
    }

    const handleDateFilterClick = () => {
        if (startDate && endDate) filterChanges();
    }

    const onStartInputChange = (e) => {
        setStartDate(e.target.value);
    }

    const onEndInputChange = (e) => {
        setEndDate(e.target.value)
    }

    const onLengthChange = (e) => {
        setLength(e.target.value)
    }

    const onPublicationChange = (e) => {
        setPublication(e.target.value)
    }

    const onSortChange = (e) => {
        setSortSelected(e.target.value);
        sortEntries(sortOptions.find(option => option.description === e.target.value).fn);
    }

    const handlePartnered = (e) => {
        setPartnerOnly(!partnerOnly)
    }

    const handleSubmitted = (e) => {
        setSubmittedOnly(!submittedOnly)
    }

    const clearFilters = (e) => {
        setLength('Any');
        setPublication('Any');
        setPartnerOnly(false);
        setSubmittedOnly(false);
        setStartDate('');
        setEndDate('');
        setSortSelected(sortOptions[0]);
        sortEntries(sortOptions[0].fn);
        setClear(!clear);
    }

    return (
        <div className={cn("flex justify-end", { "mb-0": active, "mb-0": !active })}>
            <span className={cn("px-2 mr-2 text-gray-500 opacity-50 border border-gray-500 rounded shadow", { "flex": active && startDate || endDate, "hidden": !active || !startDate && !endDate })}>MM-DD-YYYY</span>
            <div className={cn("border-l-2 pl-2 flex flex-wrap text-gray-600", {
                "opacity-100 border-green-600 transition ease-out duration-150": active,
                "opacity-0 border-gray-100 transition ease-in duration-300 transform translate-x-16": !active,
            })}>
                <input autoComplete="off" maxLength="10" className="text-center w-24 px-2 text-sm focus:outline-none"
                    type="text" onChange={onStartInputChange} value={startDate} name="start" placeholder="Start Date" />
                <input autoComplete="off" maxLength="10" className="text-center w-24 px-2 text-sm focus:outline-none"
                    type="text" onChange={onEndInputChange} value={endDate} name="end" placeholder="End Date" />
                <button onClick={handleDateFilterClick} className={cn("hover:bg-gray-100 text-gray-500 focus:outline-none mr-2 my-0 rounded inline-flex items-center", { "text-gray-700": startDate || endDate })}>
                    <svg className="fill-current w-4 h-4 m-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M2 6h60L38 32v20l-12 6V32L2 6z" /></svg>
                </button>
            </div>
            <div className="relative inline-block text-left">
                <div>
                    <span className="rounded-md shadow-sm">
                        <button onClick={() => setActive(!active)} /* onBlur={() => setActive(false)}  */ type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-1 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-green-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                            Filter
                            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </span>
                </div>


                <div className={cn("origin-top-right right-0 mt-4 w-64 rounded-md shadow-lg", {
                    "transition absolute ease-in-out duration-150 opacity-100": active,
                    "transition hidden ease-in-out duration-150 opacity-0": !active,
                })}>
                    <div className="rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div className="flex justify-between py-1">
                            <label className="block px-4 py-4 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                Length
                            </label>
                            <div className="flex justify-between py-1">
                                <div className="relative">
                                    <select onChange={onLengthChange} value={length} className="block appearance-none text-sm w-full text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-length">
                                        {lengthOptions.map((opt) => (
                                            opt && <option key={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-100"></div>
                        <div className="flex justify-between py-1">
                            <label className="block px-4 py-4 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                Publication
                             </label>
                            <div className="flex justify-end py-1">
                                <div className="relative">
                                    <select onChange={onPublicationChange} value={publication} className="block appearance-none text-sm w-full text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-publication">
                                        {publicationOptions.map((pub) => (
                                            pub && <option key={pub}>{pub}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-100"></div>
                        <div className="py-1">
                            <a onClick={handlePartnered} className={cn("block px-4 py-2 text-sm leading-5 hover:bg-gray-100 focus:outline-none", { 'text-green-700 font-medium': partnerOnly, 'hover:text-gray-700 text-gray-600': !partnerOnly })} role="menuitem">
                                Partnered Only
                            </a>
                            <a onClick={handleSubmitted} className={cn("block px-4 py-2 text-sm leading-5 hover:bg-gray-100 focus:outline-none", { 'text-green-700 font-medium': submittedOnly, 'hover:text-gray-700 text-gray-600': !submittedOnly })} role="menuitem">
                                Submitted Only
                            </a>
                        </div>
                        <div className="border-t border-gray-100"></div>
                        <div className="flex justify-between py-1">
                            <label className="block px-4 py-4 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                Sort
                            </label>
                            <div className="flex justify-between py-1">
                                <div className="relative">
                                    <select onChange={onSortChange} value={sortSelected} className="block appearance-none text-sm w-full text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-sort">
                                        {sortOptions.map((opt) => (
                                            opt && <option key={opt.key}>{opt.description}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-100"></div>                        
                        <div className="py-1">
                            <a onClick={clearFilters} className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                Clear
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}