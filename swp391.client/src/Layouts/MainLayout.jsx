import { MDBModal } from 'mdb-react-ui-kit'
import Footer from '../Component/Footer/Footer'
import NavBar2 from '../Component/NavBar/NavBar2'
import '../Layouts/MainLayout.css'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { useState } from 'react'
import SelectModal from '../Component/Modals/SelectModal'
function MainLayout({ children }) {
  const [basicModal, setBasicModal] = useState(false)

  const toggleOpen = () => setBasicModal(!basicModal)
  return (
    <div>
      <NavBar2 />
      <div style={{ height: '45px' }}></div>
      <main>{children}</main>
      <div className="fixed-bottom-right">
        <button
          className="static-button"
          data-tooltip-id="add-button"
          onClick={toggleOpen}
        >
          +
        </button>
        <Tooltip
          id="add-button"
          content={'Make An Appointment/Create New Pet'}
        ></Tooltip>

        <MDBModal
          open={basicModal}
          onClose={() => setBasicModal(false)}
          tabIndex="-1"
        >
          <SelectModal toggleOpen={toggleOpen}></SelectModal>
        </MDBModal>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
