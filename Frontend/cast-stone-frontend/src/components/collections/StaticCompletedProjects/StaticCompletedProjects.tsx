'use client';

import React from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl } from '@/utils/cloudinaryUtils';
import styles from './StaticCompletedProjects.module.css';

export interface StaticCompletedProject {
  id: string;
  collectionId: number; // Collection ID this project belongs to
  title: string;
  description: string;
  images: string[]; // 1-2 images per project
  imageAlts: string[]; // Alt text for each image
  location?: string;
  completedDate?: string;
  projectType?: string;
  clientName?: string;
}

interface StaticCompletedProjectsProps {
  projects: StaticCompletedProject[];
  currentCollectionId: number;
  title?: string;
  subtitle?: string;
  className?: string;
}

const StaticCompletedProjects: React.FC<StaticCompletedProjectsProps> = ({
  projects,
  currentCollectionId,
  title = "Featured Projects",
  subtitle = "Discover our stunning architectural stone installations",
  className = ''
}) => {
  // Filter projects by current collection ID
  const filteredProjects = projects.filter(project => project.collectionId === currentCollectionId);

  if (filteredProjects.length === 0) {
    return (
      <section className={`${styles.projectsSection} ${className}`}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>No completed projects available for this collection.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.projectsSection} ${className}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.projectsList}>
          {filteredProjects.map((project, index) => (
            <div key={project.id} className={styles.projectRow}>
              {/* Project Images */}
              <div className={styles.projectImages}>
                {project.images.slice(0, 2).map((imageSrc, imageIndex) => {
                  const optimizedImageSrc = getOptimizedImageUrl(imageSrc, 'hero');
                  const imageAlt = project.imageAlts[imageIndex] || `${project.title} - Image ${imageIndex + 1}`;
                  
                  return (
                    <div 
                      key={imageIndex} 
                      className={`${styles.imageContainer} ${project.images.length === 1 ? styles.singleImage : ''}`}
                    >
                      <Image
                        src={optimizedImageSrc}
                        alt={imageAlt}
                        fill
                        className={styles.projectImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className={styles.imageOverlay}></div>
                    </div>
                  );
                })}
              </div>

              {/* Project Information */}
              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                
                <div className={styles.projectMeta}>
                  {project.location && (
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Location:</span>
                      <span className={styles.metaValue}>{project.location}</span>
                    </div>
                  )}
                  {project.projectType && (
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Type:</span>
                      <span className={styles.metaValue}>{project.projectType}</span>
                    </div>
                  )}
                  {project.completedDate && (
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Completed:</span>
                      <span className={styles.metaValue}>{project.completedDate}</span>
                    </div>
                  )}
                  {project.clientName && (
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Client:</span>
                      <span className={styles.metaValue}>{project.clientName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaticCompletedProjects;
