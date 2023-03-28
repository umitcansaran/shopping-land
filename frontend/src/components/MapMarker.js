import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { listProfileByUser } from '../store/actions/userActions';
import { Popup, Marker } from 'react-map-gl';

export default function MapMarker({ store, selectedStore, setSelectedStore, index }) {

    const dispatch = useDispatch()

    const { profile } = useSelector(state => state.profileByUser)

    useEffect(() => {
        dispatch(listProfileByUser(store.owner))

    }, [dispatch])

  return (
    <Marker
                key={index}
                latitude={store.latitude}
                longitude={store.longitude}
              >
                { profile && (
                <button
                  className="marker-btn"
                  onClick={() => {
                    setSelectedStore(store);
                  }}
                >
                  <img
                    src={profile[0].image}
                    alt="Store Icon"
                    style={{ width: "auto", height: "13px" }}
                  />
                </button>
                )}

          {selectedStore ? (
            <Popup
              latitude={selectedStore.latitude}
              longitude={selectedStore.longitude}
              closeOnClick={false}
              onClose={() => {
                setSelectedStore(null);
              }}
            >
              <img
                src={selectedStore.image}
                alt="Store Icon"
                style={{ width: "13.3rem" }}
              />
              <strong>
                <h5 className="text-center">{selectedStore.name}</h5>
              </strong>
              <p style={{ fontSize: "0.75rem" }}>
                <strong>Address: </strong>
                {selectedStore.address}
              </p>
              <strong>
                <p>
                  Go to{" "}
                  <a href={`#/seller/${profile.id}`}>
                    {selectedStore.owner_name}
                  </a>
                  's page
                </p>
              </strong>
            </Popup>
          ) : null}
              </Marker>
  )
}
