import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';


export const SideNavData = [
    {
        title: 'Work Schedule',
        path: '/vet/WorkSchedule',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Appointment List',
        path: '/vet/AppointmentList',
        icon: <IoIcons.IoMdHelpCircle />,
        cName: 'nav-text'
    },
    {
        title: 'Medical Record',
        path: '/vet/MedicalRecordList',
        icon: <IoIcons.IoIosPaper />,
        cName: 'nav-text'
    },
    // {
    //     title: 'Hospitalization Management',
    //     path: '/vet/hospitalizationManagement',
    //     icon: <FaIcons.FaHospital />,
    //     cName: 'nav-text'
    // }
];