'use client';

import React, { useState, useEffect } from 'react';
import { collectionGetService } from '../../../services/api/collections';
import { CollectionHierarchy } from '../../../services/types/entities';

/**
 * Test component to verify navbar collections API integration
 * This component can be used to test the collections dropdown functionality
 */
const NavbarTest: React.FC = () => {
  const [collections, setCollections] = useState<CollectionHierarchy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching collections hierarchy...');
      
      const hierarchyData = await collectionGetService.getHierarchy();
      console.log('Collections fetched:', hierarchyData);
      
      setCollections(hierarchyData);
    } catch (err) {
      console.error('Failed to fetch collections:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const renderCollectionTree = (collections: CollectionHierarchy[], level = 0) => {
    return (
      <ul style={{ marginLeft: level * 20, listStyle: 'none', padding: 0 }}>
        {collections.map((collection) => (
          <li key={collection.id} style={{ margin: '5px 0' }}>
            <div style={{ 
              padding: '5px', 
              background: level === 0 ? '#f0f0f0' : '#f8f8f8',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              <strong>{collection.name}</strong>
              <span style={{ marginLeft: '10px', color: '#666' }}>
                (Level {collection.level}, Products: {collection.productCount})
              </span>
              {collection.description && (
                <div style={{ fontSize: '0.9em', color: '#888', marginTop: '2px' }}>
                  {collection.description}
                </div>
              )}
            </div>
            {collection.children && collection.children.length > 0 && (
              renderCollectionTree(collection.children, level + 1)
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #4a3728', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#faf9f7'
    }}>
      <h2 style={{ color: '#4a3728', marginBottom: '15px' }}>
        Navbar Collections Test
      </h2>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={fetchCollections}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4a3728',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Loading...' : 'Refresh Collections'}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {isLoading && (
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Loading collections...
        </div>
      )}

      {!isLoading && !error && (
        <div>
          <h3 style={{ color: '#4a3728', marginBottom: '10px' }}>
            Collections Hierarchy ({collections.length} root collections)
          </h3>
          {collections.length > 0 ? (
            renderCollectionTree(collections)
          ) : (
            <div style={{ color: '#888', fontStyle: 'italic' }}>
              No collections found
            </div>
          )}
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#e8f4f8', 
        borderRadius: '4px',
        fontSize: '0.9em'
      }}>
        <strong>Test Instructions:</strong>
        <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
          <li>This component tests the same API call used by the navbar</li>
          <li>If collections appear here, the navbar dropdown should work</li>
          <li>Check browser console for detailed API logs</li>
          <li>Verify the hierarchical structure matches your backend data</li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarTest;
