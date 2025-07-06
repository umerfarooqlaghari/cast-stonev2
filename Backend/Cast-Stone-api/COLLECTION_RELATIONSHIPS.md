# Collection Parent-Child Relationships

This document explains how parent-child relationships work in the Cast Stone collection hierarchy system.

## 🏗️ Collection Hierarchy Structure

The system supports a 3-level hierarchy:

```
Level 1 (Root)
├── Level 2 (Category)
│   ├── Level 3 (Subcategory)
│   └── Level 3 (Subcategory)
└── Level 2 (Category)
    ├── Level 3 (Subcategory)
    └── Level 3 (Subcategory)
```

## 🔗 Relationship Fields

Each collection has two relationship fields:

- **`parentCollectionId`**: Points to the parent collection (null for Level 1)
- **`childCollectionId`**: Points to the first child collection (null if no children)

## ⚡ Automatic Relationship Management

### **Enhanced Behavior (After Update)**

The system now **automatically maintains** parent-child relationships:

#### **When Creating Collections:**

1. **Level 1 Collection Created First**:
   ```json
   {
     "name": "Natural Stone",
     "level": 1,
     "parentCollectionId": null,
     "childCollectionId": null  // Initially null
   }
   ```

2. **Level 2 Collection Created Later**:
   ```json
   {
     "name": "Marble",
     "level": 2,
     "parentCollectionId": 1,  // References Level 1
     "childCollectionId": null
   }
   ```
   
   **✅ Automatic Update**: The Level 1 collection's `childCollectionId` is automatically set to the new Level 2 collection's ID.

3. **Level 3 Collection Created**:
   ```json
   {
     "name": "Carrara Marble",
     "level": 3,
     "parentCollectionId": 2,  // References Level 2
     "childCollectionId": null
   }
   ```
   
   **✅ Automatic Update**: The Level 2 collection's `childCollectionId` is automatically set to the new Level 3 collection's ID.

#### **Validation Rules:**

- ✅ **Parent Must Exist**: You cannot create a child collection if the parent doesn't exist
- ✅ **Level Validation**: Level 2 must have Level 1 parent, Level 3 must have Level 2 parent
- ✅ **Automatic Updates**: Parent collections are automatically updated when children are added

## 🛠️ API Endpoints

### **Create Collection with Auto-Relationship Updates**

```http
POST /api/collections
Content-Type: application/json

{
  "name": "Marble Collection",
  "description": "Premium marble stones",
  "level": 2,
  "parentCollectionId": 1,
  "tags": ["marble", "premium"],
  "published": true,
  "createdBy": "admin"
}
```

**Result**: 
- Creates the Level 2 collection
- Automatically updates the Level 1 parent's `childCollectionId`

### **Refresh All Relationships (Maintenance)**

```http
POST /api/collections/refresh-relationships
```

**Response**:
```json
{
  "success": true,
  "data": 5,
  "message": "Updated 5 collection relationships"
}
```

This endpoint:
- Scans all collections
- Updates `childCollectionId` to point to the first child
- Clears `childCollectionId` if no children exist
- Returns the number of collections updated

## 📋 Usage Scenarios

### **Scenario 1: Create Parent First, Then Children**

```typescript
// 1. Create Level 1 collection
const rootCollection = await collectionService.post.createRootCollection(
  "Natural Stone",
  "Premium natural stone products",
  ["natural", "stone"],
  true,
  "admin"
);
// Result: { id: 1, childCollectionId: null }

// 2. Create Level 2 collection
const categoryCollection = await collectionService.post.createSubCollection(
  "Marble",
  "Marble stone products",
  2,
  1, // parentCollectionId
  ["marble"],
  true,
  "admin"
);
// Result: { id: 2, parentCollectionId: 1, childCollectionId: null }
// Auto-update: Collection 1 now has childCollectionId: 2

// 3. Create Level 3 collection
const subCategoryCollection = await collectionService.post.createSubCollection(
  "Carrara Marble",
  "Italian Carrara marble",
  3,
  2, // parentCollectionId
  ["carrara", "italian"],
  true,
  "admin"
);
// Result: { id: 3, parentCollectionId: 2, childCollectionId: null }
// Auto-update: Collection 2 now has childCollectionId: 3
```

### **Scenario 2: Maintenance Operation**

If relationships become inconsistent (e.g., due to data migration), use the refresh operation:

```typescript
const result = await collectionService.post.refreshAllRelationships();
console.log(`Updated ${result.updatedCount} relationships`);
```

### **Scenario 3: Error Handling**

```typescript
try {
  // This will fail - parent doesn't exist
  await collectionService.post.createSubCollection(
    "Marble",
    "Marble products",
    2,
    999, // Non-existent parent
    ["marble"],
    true,
    "admin"
  );
} catch (error) {
  console.error("Error: Invalid collection hierarchy");
}
```

## 🔍 Frontend Service Usage

### **Create Collections with Automatic Relationships**

```typescript
import { collectionService } from '@/services';

// Create root collection
const naturalStone = await collectionService.post.createRootCollection(
  "Natural Stone",
  "Premium natural stone collection",
  ["natural", "premium"],
  true,
  "admin"
);

// Create child collection (automatically updates parent)
const marble = await collectionService.post.createSubCollection(
  "Marble",
  "Marble stone products",
  2,
  naturalStone.id,
  ["marble"],
  true,
  "admin"
);

// Verify relationships
const updatedParent = await collectionService.get.getById(naturalStone.id);
console.log(updatedParent.childCollectionId); // Will be marble.id
```

### **Maintenance Operations**

```typescript
// Refresh all relationships
const refreshResult = await collectionService.post.refreshAllRelationships();
if (refreshResult.success) {
  console.log(`Updated ${refreshResult.updatedCount} collection relationships`);
}
```

## 📊 Database Schema

```sql
-- Collections table structure
CREATE TABLE Collections (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Description TEXT,
    Level INTEGER NOT NULL CHECK (Level BETWEEN 1 AND 3),
    ParentCollectionId INTEGER REFERENCES Collections(Id),
    ChildCollectionId INTEGER REFERENCES Collections(Id),
    Tags TEXT[],
    Published BOOLEAN DEFAULT FALSE,
    CreatedBy VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    UpdatedAt TIMESTAMP
);

-- Constraints
ALTER TABLE Collections ADD CONSTRAINT chk_level_parent 
CHECK (
    (Level = 1 AND ParentCollectionId IS NULL) OR
    (Level > 1 AND ParentCollectionId IS NOT NULL)
);
```

## ⚠️ Important Notes

1. **First Child Only**: `childCollectionId` points to the **first** child collection, not all children
2. **Automatic Updates**: Relationships are updated automatically on creation
3. **Validation**: Parent collections must exist before creating children
4. **Maintenance**: Use the refresh endpoint if relationships become inconsistent
5. **Performance**: The automatic update adds minimal overhead to collection creation

## 🔧 Migration Guide

If you have existing collections with inconsistent relationships:

1. **Run the refresh operation**:
   ```bash
   POST /api/collections/refresh-relationships
   ```

2. **Or use the frontend service**:
   ```typescript
   await collectionService.post.refreshAllRelationships();
   ```

This will scan all collections and fix any inconsistent parent-child relationships.

## 🎯 Best Practices

1. **Create in Order**: Create parent collections before children when possible
2. **Use Validation**: The API will prevent invalid hierarchy creation
3. **Regular Maintenance**: Run refresh operations after data imports
4. **Monitor Relationships**: Check that `childCollectionId` is properly set after creation
5. **Error Handling**: Always handle hierarchy validation errors in your frontend

The enhanced system now provides **automatic relationship management** while maintaining data integrity and hierarchy validation.
