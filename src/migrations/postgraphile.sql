COMMENT ON TABLE mikro_orm_migrations is '@omit';
COMMENT ON CONSTRAINT tag_parent_parent_taxonomy_group_id_parent_id_foreign ON tag_parent IS 
'@fieldName parent
@foreignFieldName children';
COMMENT ON CONSTRAINT tag_parent_tag_taxonomy_group_id_tag_id_foreign ON tag_parent IS 
'@fieldName tag
@foreignFieldName parent';
COMMENT ON CONSTRAINT tag_property_tag_taxonomy_group_id_tag_id_foreign ON tag_property IS 
'@fieldName tag
@foreignFieldName properties';
COMMENT ON CONSTRAINT product_ingredient_parent_product_id_parent_sequence_foreign on product_ingredient IS
'@fieldName parentIngredient
@foreignFieldName contains';
COMMENT ON CONSTRAINT product_ingredient_ingredient_taxonomy_group_id_i_21439_foreign on product_ingredient IS
'@fieldName tag
@foreignFieldName referencedbyProducts';
-- TODO: Add more here to tidy up the GraphQL API
